import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { machines } from '@/data/machines'
import { locations } from '@/data/locations'

const TOP = [...machines].sort((a, b) => b.totalSales - a.totalSales).slice(0, 5)

function statusVariant(s: string) {
  if (s === 'active') return 'success'
  if (s === 'offline') return 'danger'
  return 'warning'
}

export function TopMachinesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Machines</CardTitle>
      </CardHeader>
      <Table>
        <Thead>
          <Tr>
            <Th>Machine</Th>
            <Th>Location</Th>
            <Th className="text-right">Sales ($)</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {TOP.map((m) => {
            const loc = locations.find((l) => l.id === m.locationId)
            return (
              <Tr key={m.id}>
                <Td className="font-medium">{m.id}</Td>
                <Td className="text-[var(--text-muted)]">{loc?.name ?? '—'}</Td>
                <Td className="text-right tabular-nums">{m.totalSales.toLocaleString()}</Td>
                <Td>
                  <Badge variant={statusVariant(m.status)}>
                    {m.status.replace('_', ' ')}
                  </Badge>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Card>
  )
}
