'use server'

import { pool } from '@/utils/db'
import { getSession } from '@/utils/session'
import { redirect } from 'next/navigation'

export async function changePassword(
  newPassword: string
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) redirect('/login')

  try {
    await pool.query(
      `UPDATE auth.users
       SET encrypted_password = crypt($1, gen_salt('bf')), updated_at = now()
       WHERE id = $2`,
      [newPassword, session.userId]
    )
    return {}
  } catch (err: unknown) {
    return { error: (err as Error).message }
  }
}
