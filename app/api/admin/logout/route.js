export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { deleteAdminSession, getAdminCookieName } from '@/lib/admin-auth'

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(getAdminCookieName())?.value

    if (token) {
      await deleteAdminSession(token)
    }

    cookieStore.delete(getAdminCookieName())

    return Response.json({ ok: true })
  } catch (error) {
    console.error('ADMIN LOGOUT ERROR:', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong during logout.'
    return Response.json({ error: message }, { status: 500 })
  }
}