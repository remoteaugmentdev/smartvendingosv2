import { NextResponse, type NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/utils/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths always pass through
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/landing') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next({ request })
  }

  const session = await getSessionFromRequest(request)

  // Admin area is master-only; its entrance is the admin login page
  if (pathname.startsWith('/admin') && session?.role !== 'master') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // No session → send to the landing page; the demo form is the public entrance
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
