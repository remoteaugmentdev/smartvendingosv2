import { NextResponse, type NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/utils/session'
import { isCompanyDemoLink, parseCompanyRoute } from '@/utils/companyLink'

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
    pathname === '/favicon.ico' ||
    isCompanyDemoLink(pathname)
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

  // Personalized in-app URLs (/{slug}/dashboard, /{slug}/orders, ...): keep the
  // slug visible in the address bar but serve the real route underneath. No
  // data is scoped by slug: this app has no per-tenant data, see AGENTS.md.
  const companyRoute = parseCompanyRoute(pathname)
  if (companyRoute) {
    const url = request.nextUrl.clone()
    url.pathname = companyRoute
    return NextResponse.rewrite(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
