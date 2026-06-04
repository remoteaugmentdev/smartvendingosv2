'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { UserPlus } from 'lucide-react'

type Role = 'Admin' | 'Manager' | 'Dispatcher' | 'Technician' | 'Viewer'

const ROLE_VARIANT: Record<Role, 'success' | 'info' | 'warning' | 'default'> = {
  Admin: 'success',
  Manager: 'info',
  Dispatcher: 'warning',
  Technician: 'default',
  Viewer: 'default',
}

const members: {
  name: string; email: string; role: Role; routes: string; status: 'Active' | 'Suspended'; lastActive: string
}[] = [
  { name: 'Alex Johnson', email: 'alex@peakvending.com', role: 'Admin', routes: 'All', status: 'Active', lastActive: '2 min ago' },
  { name: 'Sarah Davis', email: 'sarah@peakvending.com', role: 'Manager', routes: 'All', status: 'Active', lastActive: '1 h ago' },
  { name: 'Bob Williams', email: 'bob@peakvending.com', role: 'Dispatcher', routes: 'Route C', status: 'Active', lastActive: '3 h ago' },
  { name: 'John Martinez', email: 'john@peakvending.com', role: 'Technician', routes: 'Route A', status: 'Active', lastActive: 'Yesterday' },
  { name: 'Maria Chen', email: 'maria@peakvending.com', role: 'Technician', routes: 'Route B', status: 'Active', lastActive: 'Yesterday' },
  { name: 'Mike Brown', email: 'mike@peakvending.com', role: 'Viewer', routes: '—', status: 'Suspended', lastActive: '2 weeks ago' },
]

export default function TeamPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Team" description={`${members.length} members · 5 roles`}>
        <Button size="sm"><UserPlus size={16} /> Invite Member</Button>
      </PageHeader>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th className="hidden sm:table-cell">Email</Th>
              <Th>Role</Th>
              <Th className="hidden md:table-cell">Assigned Routes</Th>
              <Th>Status</Th>
              <Th className="hidden lg:table-cell">Last Active</Th>
            </Tr>
          </Thead>
          <Tbody>
            {members.map((m) => (
              <Tr key={m.email}>
                <Td className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {m.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    {m.name}
                  </div>
                </Td>
                <Td className="hidden sm:table-cell text-xs text-[var(--text-muted)]">{m.email}</Td>
                <Td><Badge variant={ROLE_VARIANT[m.role]}>{m.role}</Badge></Td>
                <Td className="hidden md:table-cell text-[var(--text-muted)]">{m.routes}</Td>
                <Td>
                  <Badge variant={m.status === 'Active' ? 'success' : 'danger'}>{m.status}</Badge>
                </Td>
                <Td className="hidden lg:table-cell text-xs text-[var(--text-muted)]">{m.lastActive}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
