import { NextResponse } from 'next/server'
import { getAdminBasePath, getAllowedAdminIps } from '@/lib/admin/config'
import { getClientIpFromHeaders, isIpAllowed } from '@/lib/admin/security'

export function proxy(request) {
  const { pathname } = request.nextUrl
  const adminBasePath = getAdminBasePath()
  const allowedIps = getAllowedAdminIps()
  const ip = getClientIpFromHeaders(request.headers)

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const isHiddenAdminPage =
    pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`)
  const isAdminApi = pathname.startsWith('/api/admin/')

  if ((isHiddenAdminPage || isAdminApi) && !isIpAllowed(ip, allowedIps)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (isHiddenAdminPage) {
    const targetPath = pathname.replace(adminBasePath, '/admin') || '/admin'
    const url = request.nextUrl.clone()
    url.pathname = targetPath

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
