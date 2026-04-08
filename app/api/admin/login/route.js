// app/api/admin/login/route.js

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'  // ✅ NEW — fixes externalRequire errors

import { cookies } from 'next/headers'
import {
  authenticateAdmin,
  createAdminSession,
  getAdminCookieName,
  getAdminSessionMaxAge,
} from '@/lib/admin-auth'
import { getAllowedAdminIps } from '@/lib/admin-config'
import {
  clearFailedLogins,
  getClientIpFromHeaders,
  getLoginRateLimitState,
  isIpAllowed,
  recordFailedLogin,
  recordLoginAttempt,
  wait,
} from '@/lib/admin-security'

export async function POST(request) {
  try {
    const ip = request?.headers
      ? getClientIpFromHeaders(request.headers)
      : 'unknown'

    const allowedIps = getAllowedAdminIps()

    if (!isIpAllowed(ip, allowedIps)) {
      return Response.json({ error: 'Not found.' }, { status: 404 })
    }

    const rateKey = ip || 'unknown'
    const rateState = getLoginRateLimitState(rateKey)

    if (!rateState.allowed) {
      return Response.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    recordLoginAttempt(rateKey)

    let body = {}
    try {
      body = await request.json()
    } catch {}

    const username = `${body?.username || ''}`.trim()
    const password = `${body?.password || ''}`.trim()

    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      )
    }

    const admin = await authenticateAdmin(username, password)

    if (!admin) {
      const delay = recordFailedLogin(rateKey)
      await wait(delay)
      return Response.json(
        { error: 'Invalid admin credentials.' },
        { status: 401 }
      )
    }

    clearFailedLogins(rateKey)

    const session = await createAdminSession(admin.id, {
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
    })

    const cookieStore = await cookies()  // ✅ await added

    cookieStore.set(getAdminCookieName(), session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getAdminSessionMaxAge(),
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error)

    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong during admin login.'

    return Response.json({ error: message }, { status: 500 })
  }
}