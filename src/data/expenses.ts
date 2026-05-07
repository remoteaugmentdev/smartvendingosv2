export interface ExpenseRecord {
  id: string
  category: 'fuel' | 'repairs' | 'refunds'
  amount: number
  date: string
  description: string
}

export const expenses: ExpenseRecord[] = [
  { id: 'e-001', category: 'fuel',    amount: 4.2,  date: '2026-04-02', description: 'Fuel - Route 1' },
  { id: 'e-002', category: 'repairs', amount: 3.5,  date: '2026-04-03', description: 'M-006 compressor fix' },
  { id: 'e-003', category: 'fuel',    amount: 3.8,  date: '2026-04-05', description: 'Fuel - Route 2' },
  { id: 'e-004', category: 'refunds', amount: 1.5,  date: '2026-04-07', description: 'Customer refund M-003' },
  { id: 'e-005', category: 'fuel',    amount: 4.0,  date: '2026-04-09', description: 'Fuel - Weekend run' },
  { id: 'e-006', category: 'repairs', amount: 2.8,  date: '2026-04-10', description: 'M-008 coin mech repair' },
  { id: 'e-007', category: 'fuel',    amount: 3.6,  date: '2026-04-12', description: 'Fuel - Route 1' },
  { id: 'e-008', category: 'refunds', amount: 0.75, date: '2026-04-13', description: 'Customer refund M-001' },
  { id: 'e-009', category: 'fuel',    amount: 4.1,  date: '2026-04-15', description: 'Fuel - Route 3' },
  { id: 'e-010', category: 'repairs', amount: 1.8,  date: '2026-04-16', description: 'M-003 display repair' },
  { id: 'e-011', category: 'fuel',    amount: 3.9,  date: '2026-04-18', description: 'Fuel - Route 2' },
  { id: 'e-012', category: 'repairs', amount: 2.2,  date: '2026-04-19', description: 'M-011 motor replacement' },
  { id: 'e-013', category: 'fuel',    amount: 3.7,  date: '2026-04-21', description: 'Fuel - Route 4' },
  { id: 'e-014', category: 'refunds', amount: 1.25, date: '2026-04-22', description: 'Customer refund M-007' },
  { id: 'e-015', category: 'fuel',    amount: 4.3,  date: '2026-04-24', description: 'Fuel - Route 1' },
  { id: 'e-016', category: 'repairs', amount: 2.5,  date: '2026-04-25', description: 'M-006 refrigerant recharge' },
  { id: 'e-017', category: 'fuel',    amount: 3.5,  date: '2026-04-27', description: 'Fuel - Route 2' },
  { id: 'e-018', category: 'repairs', amount: 1.2,  date: '2026-04-28', description: 'M-004 door seal' },
  { id: 'e-019', category: 'fuel',    amount: 4.0,  date: '2026-04-29', description: 'Fuel - Route 3' },
  { id: 'e-020', category: 'refunds', amount: 0.5,  date: '2026-04-30', description: 'Customer refund M-010' },
]
