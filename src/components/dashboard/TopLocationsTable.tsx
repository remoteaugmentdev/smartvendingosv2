import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { locations } from '@/data/locations'

const TOP = [...locations].sort((a, b) => b.totalSales - a.totalSales).slice(0, 5)

export function TopLocationsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Locations</CardTitle>
      </CardHeader>
      <Table>
        <Thead>
          <Tr>
            <Th>Location</Th>
            <Th className="text-right">Sales ($)</Th>
            <Th className="text-right">Machines</Th>
          </Tr>
        </Thead>
        <Tbody>
          {TOP.map((loc) => (
            <Tr key={loc.id}>
              <Td>
                <span className="cursor-pointer font-medium text-[var(--accent-primary)] hover:underline">
                  {loc.name}
                </span>
              </Td>
              <Td className="text-right tabular-nums">{loc.totalSales.toLocaleString()}</Td>
              <Td className="text-right tabular-nums">{loc.machineCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
