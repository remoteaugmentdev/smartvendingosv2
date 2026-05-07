import { NextResponse } from 'next/server'
import { pool } from '@/utils/db'
import { signSession, COOKIE_NAME } from '@/utils/session'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Verify password using Postgres pgcrypto crypt() — same algo Supabase uses
    const { rows } = await pool.query(
      `SELECT id, email
       FROM auth.users
       WHERE email = $1
         AND encrypted_password = crypt($2, encrypted_password)
         AND email_confirmed_at IS NOT NULL`,
      [email, password]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = rows[0]

    // Fetch profile role
    const profileRes = await pool.query(
      `SELECT role, expires_at FROM public.profiles WHERE id = $1`,
      [user.id]
    )
    const profile = profileRes.rows[0]

    // Check expiry for demo accounts
    if (profile?.expires_at && new Date(profile.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This demo account has expired.' }, { status: 403 })
    }

    const role = profile?.role ?? 'demo'

    // Sign a JWT session
    const token = await signSession({ userId: user.id, email: user.email, role })

    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  } catch (err) {
    console.error('[auth/login]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
