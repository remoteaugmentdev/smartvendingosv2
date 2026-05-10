import { NextResponse } from 'next/server'
import { pool } from '@/utils/db'

// One-time endpoint — only works when encrypted_password is NULL
export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  // Check if the account exists and has no password yet
  const { rows } = await pool.query(
    `SELECT id, encrypted_password FROM auth.users WHERE email = $1`,
    [email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  if (rows[0].encrypted_password) {
    return NextResponse.json({ error: 'Password already set — use login instead' }, { status: 403 })
  }

  await pool.query(
    `UPDATE auth.users
     SET encrypted_password = crypt($1, gen_salt('bf')), updated_at = now()
     WHERE email = $2`,
    [password, email]
  )

  return NextResponse.json({ ok: true })
}
