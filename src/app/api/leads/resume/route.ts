import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/utils/db'
import { signSession, getSessionFromRequest, COOKIE_NAME } from '@/utils/session'

// Re-enters the demo dashboard for a slug that was already filled out,
// even if the session cookie is gone (e.g. after signing out). Mints a
// fresh demo session from the existing lead record and redirects in.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.trim()
  if (!slug) return NextResponse.redirect(new URL('/', request.url))

  const { rows } = await pool.query(
    `SELECT id, email FROM public.leads WHERE slug = $1 AND full_name IS NOT NULL AND email IS NOT NULL`,
    [slug]
  )
  const lead = rows[0]
  if (!lead) return NextResponse.redirect(new URL(`/${slug}`, request.url))

  const response = NextResponse.redirect(new URL(`/${slug}/dashboard`, request.url))

  const existing = await getSessionFromRequest(request)
  const token = existing?.role === 'master'
    ? await signSession({ userId: existing.userId, email: existing.email, role: existing.role, slug })
    : await signSession({ userId: lead.id, email: lead.email, role: 'demo', slug })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
