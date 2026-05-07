export interface Trip {
  id: string
  driverId: string
  date: string
  machinesServiced: string[]
  status: 'completed' | 'in_progress' | 'scheduled'
  totalCollected: number
  totalRestocked: number
}

export const trips: Trip[] = [
  { id: 'T-001', driverId: 'D-1', date: '2026-04-01', machinesServiced: ['M-001', 'M-002', 'M-003'], status: 'completed',   totalCollected: 420, totalRestocked: 180 },
  { id: 'T-002', driverId: 'D-2', date: '2026-04-02', machinesServiced: ['M-004', 'M-005'],           status: 'completed',   totalCollected: 380, totalRestocked: 160 },
  { id: 'T-003', driverId: 'D-3', date: '2026-04-03', machinesServiced: ['M-006', 'M-007', 'M-008'], status: 'completed',   totalCollected: 310, totalRestocked: 140 },
  { id: 'T-004', driverId: 'D-1', date: '2026-04-08', machinesServiced: ['M-009', 'M-010'],           status: 'completed',   totalCollected: 450, totalRestocked: 190 },
  { id: 'T-005', driverId: 'D-2', date: '2026-04-09', machinesServiced: ['M-011', 'M-012'],           status: 'completed',   totalCollected: 340, totalRestocked: 145 },
  { id: 'T-006', driverId: 'D-3', date: '2026-04-10', machinesServiced: ['M-001', 'M-004', 'M-007'], status: 'completed',   totalCollected: 510, totalRestocked: 215 },
  { id: 'T-007', driverId: 'D-1', date: '2026-04-15', machinesServiced: ['M-002', 'M-005', 'M-008'], status: 'completed',   totalCollected: 390, totalRestocked: 165 },
  { id: 'T-008', driverId: 'D-2', date: '2026-04-16', machinesServiced: ['M-003', 'M-006'],           status: 'completed',   totalCollected: 290, totalRestocked: 125 },
  { id: 'T-009', driverId: 'D-3', date: '2026-04-17', machinesServiced: ['M-009', 'M-011'],           status: 'completed',   totalCollected: 360, totalRestocked: 155 },
  { id: 'T-010', driverId: 'D-1', date: '2026-04-22', machinesServiced: ['M-010', 'M-012'],           status: 'completed',   totalCollected: 480, totalRestocked: 200 },
  { id: 'T-011', driverId: 'D-2', date: '2026-04-23', machinesServiced: ['M-001', 'M-003', 'M-005'], status: 'completed',   totalCollected: 420, totalRestocked: 178 },
  { id: 'T-012', driverId: 'D-3', date: '2026-04-29', machinesServiced: ['M-002', 'M-006', 'M-009'], status: 'completed',   totalCollected: 350, totalRestocked: 150 },
  { id: 'T-013', driverId: 'D-1', date: '2026-05-03', machinesServiced: ['M-004', 'M-007', 'M-010'], status: 'in_progress', totalCollected: 210, totalRestocked: 90 },
  { id: 'T-014', driverId: 'D-2', date: '2026-05-03', machinesServiced: ['M-008', 'M-011'],           status: 'scheduled',   totalCollected: 0,   totalRestocked: 0 },
  { id: 'T-015', driverId: 'D-3', date: '2026-05-04', machinesServiced: ['M-001', 'M-012'],           status: 'scheduled',   totalCollected: 0,   totalRestocked: 0 },
]
