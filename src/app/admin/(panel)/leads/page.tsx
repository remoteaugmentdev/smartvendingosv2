import { format, isAfter, subDays } from 'date-fns'
import { Download, Inbox } from 'lucide-react'
import { pool } from '@/utils/db'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'

export const metadata = { title: 'Leads — SmartVendingOS' }
export const dynamic = 'force-dynamic'

type Lead = {
  id: string
  full_name: string
  email: string
  company: string
  fleet_size: string
  pain_point: string
  current_solution: string
  created_at: string
}

const HIGH_PRIORITY_FLEETS = ['51-200', '200+']

async function getLeads(): Promise<Lead[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, email, company, fleet_size, pain_point, current_solution, created_at
       FROM public.leads
       ORDER BY created_at DESC`
    )
    return rows
  } catch (err) {
    // Table is created by the first form submission; until then there are simply no leads
    if ((err as { code?: string }).code === '42P01') return []
    throw err
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  const highPriorityCount = leads.filter((l) => HIGH_PRIORITY_FLEETS.includes(l.fleet_size)).length
  const sevenDaysAgo = subDays(new Date(), 7)
  const recentCount = leads.filter((l) => isAfter(new Date(l.created_at), sevenDaysAgo)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">Demo Leads</h1>
          <p className="text-xs text-[var(--text-muted)]">
            People who requested access to the interactive demo
          </p>
        </div>
        {/* ponytail: Button renders <button> only, so this <a> copies its primary+md classes */}
        <a
          href="/admin/leads/export"
          download
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-4 text-sm font-medium text-white shadow-md shadow-blue-200 transition-all hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
        >
          <Download size={15} />
          Export CSV
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <StatCard label="Total leads" value={leads.length} color="var(--accent-primary)" />
        </Card>
        <Card>
          <StatCard label="High priority" value={highPriorityCount} color="var(--accent-warning)" />
        </Card>
        <Card>
          <StatCard label="Last 7 days" value={recentCount} color="var(--accent-success)" />
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">All leads</h3>
          <span className="text-xs text-[var(--text-muted)]">{leads.length} total</span>
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <Inbox size={28} className="text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-primary)]">No leads yet.</p>
            <p className="text-xs text-[var(--text-muted)]">
              They appear here as soon as someone starts the interactive demo.
            </p>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Company</Th>
                <Th>Fleet size</Th>
                <Th>Biggest challenge</Th>
                <Th>Current solution</Th>
                <Th>Submitted</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leads.map((l) => (
                <Tr key={l.id}>
                  <Td className="font-medium">{l.full_name}</Td>
                  <Td>
                    <a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">
                      {l.email}
                    </a>
                  </Td>
                  <Td>{l.company}</Td>
                  <Td>
                    <Badge variant={HIGH_PRIORITY_FLEETS.includes(l.fleet_size) ? 'success' : 'default'}>
                      {l.fleet_size} machines
                    </Badge>
                  </Td>
                  <Td className="max-w-[26ch] truncate text-[var(--text-muted)]" title={l.pain_point}>
                    {l.pain_point}
                  </Td>
                  <Td className="max-w-[26ch] truncate text-[var(--text-muted)]" title={l.current_solution}>
                    {l.current_solution}
                  </Td>
                  <Td className="text-[var(--text-muted)]">
                    {format(new Date(l.created_at), 'MMM d, yyyy HH:mm')}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
