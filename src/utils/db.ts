import { Pool } from 'pg'

// Global singleton so the pool survives hot-reloads in dev
const g = global as unknown as { _pool?: Pool }

export const pool =
  g._pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
  })

if (process.env.NODE_ENV !== 'production') g._pool = pool
