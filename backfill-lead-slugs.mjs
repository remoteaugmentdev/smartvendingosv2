import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local backfill-lead-slugs.mjs');
  process.exit(1);
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

// One-off: leads submitted from the bare landing page before the API started
// deriving a slug have slug IS NULL, so they show no demo link in the admin table.
// The base expression mirrors slugify() in src/utils/slug.ts.
async function run() {
  try {
    await client.connect();

    const { rows } = await client.query(`
      SELECT id, company,
             COALESCE(NULLIF(trim(both '-' from regexp_replace(lower(company), '[^a-z0-9]+', '-', 'g')), ''), 'demo') AS base
      FROM public.leads
      WHERE slug IS NULL
      ORDER BY created_at
    `);
    console.log(`${rows.length} lead(s) without a slug.`);

    for (const { id, company, base } of rows) {
      for (let n = 0; ; n++) {
        const candidate = n === 0 ? base : `${base}-${n + 1}`;
        const res = await client.query(
          `UPDATE public.leads SET slug = $1
           WHERE id = $2 AND NOT EXISTS (SELECT 1 FROM public.leads WHERE slug = $1)`,
          [candidate, id]
        );
        if (res.rowCount) {
          console.log(`  ${company} -> /${candidate}`);
          break;
        }
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
