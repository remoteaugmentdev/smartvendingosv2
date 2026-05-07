import { NextResponse, type NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/utils/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths always pass through
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next({ request })
  }

  const session = await getSessionFromRequest(request)

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin area is master-only
  if (pathname.startsWith('/admin') && session.role !== 'master') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
