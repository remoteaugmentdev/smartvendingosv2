'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { products } from '@/data/products'

const LOW_STOCK = products.filter((p) => p.stock < p.reorderLevel)

export function ReorderAlerts() {
  const [dismissed, setDismissed] = useState<string[]>([])

  const visible = LOW_STOCK.filter((p) => !dismissed.includes(p.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reorder Alerts</CardTitle>
        <Badge variant="warning">{visible.length} items</Badge>
      </CardHeader>
      {visible.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="No products need reordering right now."
          icon={<AlertTriangle size={24} />}
        />
      ) : (
        <div className="space-y-2">
          {visible.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{p.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Stock: {p.stock} / Reorder at: {p.reorderLevel}
                </p>
              </div>
              <button
                onClick={() => setDismissed((prev) => [...prev, p.id])}
                className="ml-4 shrink-0 rounded-md px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-primary)]"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
