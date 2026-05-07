export type MachineStatus = 'online' | 'offline' | 'warning'
export type OrderStatus = 'completed' | 'refunded' | 'failed'
export type AlertType = 'offline' | 'low_stock' | 'motor_error' | 'expiry' | 'payment_error'
export type UserRole = 'Admin' | 'Technician' | 'Producer' | 'Developer'
export type UserStatus = 'active' | 'pending' | 'inactive'
export type MappingStatus = 'verified' | 'pending' | 'unmapped'
export type EslStatus = 'synced' | 'out_of_sync' | 'never_pushed' | 'push_failed'

export const ldaMachines = [
  {
    id: '8825050300', name: 'Transfert aux French',
    location: 'Paris 15e — 12 Rue Lecourbe', model: 'VMGZ-WM22T2',
    status: 'online' as MachineStatus, route: 'Route A - Paris Nord',
    revenueToday: 124.50, capacity: 950, inventory: 939,
    shortageRate: 1.2, shortageThreshold: 5,
    revenueMonthly: [980, 1020, 1100, 1240, 1180, 1310],
    lastPing: '2026-05-07T10:42:00', powerConsumption: 10.67,
    cabinets: 3, totalSlots: 36, expiryDate: '2027-03-01',
  },
  {
    id: '62160463', name: 'Aurora',
    location: 'Hamburg, Germany', model: 'VMGZ-WM18T1',
    status: 'online' as MachineStatus, route: 'Route B - Hamburg',
    revenueToday: 87.20, capacity: 640, inventory: 628,
    shortageRate: 1.9, shortageThreshold: 5,
    revenueMonthly: [720, 810, 790, 870, 840, 920],
    lastPing: '2026-05-07T10:38:00', powerConsumption: 7.43,
    cabinets: 2, totalSlots: 24, expiryDate: '2027-06-01',
  },
  {
    id: '8825180003', name: 'Paris Nord Station',
    location: 'Paris 10e — Gare du Nord', model: 'VMGZ-WM30T3',
    status: 'offline' as MachineStatus, route: 'Route A - Paris Nord',
    revenueToday: 0, capacity: 1280, inventory: 1201,
    shortageRate: 6.2, shortageThreshold: 5,
    revenueMonthly: [1100, 980, 1050, 0, 1200, 1150],
    lastPing: '2026-05-06T18:12:00', powerConsumption: 0,
    cabinets: 3, totalSlots: 48, expiryDate: '2026-12-01',
  },
]

export const ldaProducts = [
  { id: 'P001', name: 'Jus Orange 25cl', category: 'Beverages', price: 2.50,
    barcode: '3270190022543', siret: '38412568900034', producer: 'Marie Dupont',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 18, capacity: 20, reorderLevel: 5, totalSales: 42, totalRevenue: 105.00,
    machines: ['8825050300', '62160463'], aisleCode: 'A-101' },
  { id: 'P002', name: 'Chips Barbecue', category: 'Snacks', price: 1.80,
    barcode: '8410199015786', siret: '52318940100025', producer: 'Pierre Martin',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'out_of_sync' as EslStatus, eslLastPushed: '2026-04-20T14:00:00',
    stock: 14, capacity: 20, reorderLevel: 5, totalSales: 38, totalRevenue: 68.40,
    machines: ['8825050300'], aisleCode: 'A-102' },
  { id: 'P003', name: 'Sandwich Jambon', category: 'Fresh Food', price: 4.20,
    barcode: '3596710412837', siret: '71204836500018', producer: 'Sophie Bernard',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 6, capacity: 10, reorderLevel: 3, totalSales: 29, totalRevenue: 121.80,
    machines: ['8825050300', '8825180003'], aisleCode: 'B-103' },
  { id: 'P004', name: 'Eau Minérale 50cl', category: 'Beverages', price: 1.20,
    barcode: '3274080001833', siret: '38412568900034', producer: 'Marie Dupont',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 19, capacity: 20, reorderLevel: 5, totalSales: 61, totalRevenue: 73.20,
    machines: ['8825050300', '62160463', '8825180003'], aisleCode: 'A-104' },
  { id: 'P005', name: 'Barre Chocolat', category: 'Snacks', price: 1.50,
    barcode: '5000159459228', siret: '84710293600011', producer: 'Jean Moreau',
    status: 'active', mappingStatus: 'pending' as MappingStatus,
    eslStatus: 'never_pushed' as EslStatus, eslLastPushed: null,
    stock: 4, capacity: 15, reorderLevel: 5, totalSales: 33, totalRevenue: 49.50,
    machines: ['8825050300'], aisleCode: 'B-106' },
  { id: 'P006', name: 'Café Noisette', category: 'Beverages', price: 1.80,
    barcode: '3228857000166', siret: '52318940100025', producer: 'Pierre Martin',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'push_failed' as EslStatus, eslLastPushed: '2026-04-28T10:00:00',
    stock: 11, capacity: 15, reorderLevel: 4, totalSales: 55, totalRevenue: 99.00,
    machines: ['62160463'], aisleCode: 'A-105' },
  { id: 'P007', name: 'Yaourt Fraise', category: 'Fresh Food', price: 2.00,
    barcode: '3033490004743', siret: '71204836500018', producer: 'Sophie Bernard',
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 3, capacity: 8, reorderLevel: 3, totalSales: 22, totalRevenue: 44.00,
    machines: ['62160463'], aisleCode: 'A-107' },
  { id: 'P008', name: 'Kit Stylos', category: 'Office', price: 3.50,
    barcode: '4901427118754', siret: null, producer: null,
    status: 'pending', mappingStatus: 'unmapped' as MappingStatus,
    eslStatus: 'never_pushed' as EslStatus, eslLastPushed: null,
    stock: 9, capacity: 10, reorderLevel: 2, totalSales: 8, totalRevenue: 28.00,
    machines: ['8825180003'], aisleCode: 'C-108' },
]

export const ldaProducers = [
  { id: 'PR001', name: 'Marie Dupont', siret: '38412568900034',
    machinesAssigned: 2, productsCount: 12, status: 'active', email: 'marie@dupont.fr' },
  { id: 'PR002', name: 'Pierre Martin', siret: '52318940100025',
    machinesAssigned: 1, productsCount: 9, status: 'active', email: 'pierre@martin.fr' },
  { id: 'PR003', name: 'Sophie Bernard', siret: '71204836500018',
    machinesAssigned: 2, productsCount: 7, status: 'active', email: 'sophie@bernard.fr' },
]

export const ldaOrders = [
  { id: 'ORD-001', product: 'Jus Orange 25cl', deviceId: '8825050300', slot: 'A-101', amount: 2.50, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: '38412568900034', date: '2026-05-07T09:12:00' },
  { id: 'ORD-002', product: 'Chips Barbecue', deviceId: '62160463', slot: 'A-102', amount: 1.80, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: '52318940100025', date: '2026-05-07T09:18:00' },
  { id: 'ORD-003', product: 'Sandwich Jambon', deviceId: '8825050300', slot: 'B-103', amount: 4.20, payment: 'card', status: 'refunded' as OrderStatus, refund: 'refunded', siret: '71204836500018', date: '2026-05-07T09:35:00' },
  { id: 'ORD-004', product: 'Eau Minérale 50cl', deviceId: '8825050300', slot: 'A-104', amount: 1.20, payment: 'cash', status: 'completed' as OrderStatus, refund: 'none', siret: '38412568900034', date: '2026-05-07T09:52:00' },
  { id: 'ORD-005', product: 'Café Noisette', deviceId: '62160463', slot: 'A-105', amount: 1.80, payment: 'card', status: 'failed' as OrderStatus, refund: 'none', siret: '52318940100025', date: '2026-05-07T10:04:00' },
  { id: 'ORD-006', product: 'Barre Chocolat', deviceId: '8825050300', slot: 'B-106', amount: 1.50, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: '84710293600011', date: '2026-05-07T10:21:00' },
  { id: 'ORD-007', product: 'Yaourt Fraise', deviceId: '62160463', slot: 'A-107', amount: 2.00, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: '71204836500018', date: '2026-05-07T10:33:00' },
  { id: 'ORD-008', product: 'Jus Orange 25cl', deviceId: '8825050300', slot: 'A-101', amount: 2.50, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: '38412568900034', date: '2026-05-07T10:45:00' },
  { id: 'ORD-009', product: 'Kit Stylos', deviceId: '8825180003', slot: 'C-108', amount: 3.50, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-06T14:20:00' },
  { id: 'ORD-010', product: 'Eau Minérale 50cl', deviceId: '62160463', slot: 'A-104', amount: 1.20, payment: 'cash', status: 'completed' as OrderStatus, refund: 'none', siret: '38412568900034', date: '2026-05-06T15:10:00' },
  { id: 'ORD-011', product: 'Sandwich Jambon', deviceId: '8825180003', slot: 'B-103', amount: 4.20, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: '71204836500018', date: '2026-05-06T11:05:00' },
  { id: 'ORD-012', product: 'Chips Barbecue', deviceId: '8825050300', slot: 'A-102', amount: 1.80, payment: 'card', status: 'refunded' as OrderStatus, refund: 'refunded', siret: '52318940100025', date: '2026-05-05T16:40:00' },
  { id: 'ORD-013', product: 'Café Noisette', deviceId: '62160463', slot: 'A-105', amount: 1.80, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: '52318940100025', date: '2026-05-05T09:22:00' },
  { id: 'ORD-014', product: 'Jus Orange 25cl', deviceId: '8825180003', slot: 'A-101', amount: 2.50, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: '38412568900034', date: '2026-05-04T12:15:00' },
  { id: 'ORD-015', product: 'Barre Chocolat', deviceId: '8825050300', slot: 'B-106', amount: 1.50, payment: 'cash', status: 'failed' as OrderStatus, refund: 'none', siret: '84710293600011', date: '2026-05-04T17:30:00' },
]

export const ldaWeeklyRevenue = [
  { day: 'Mon', revenue: 142.50, orders: 58 },
  { day: 'Tue', revenue: 168.20, orders: 71 },
  { day: 'Wed', revenue: 155.80, orders: 64 },
  { day: 'Thu', revenue: 211.70, orders: 89 },
  { day: 'Fri', revenue: 243.90, orders: 102 },
  { day: 'Sat', revenue: 198.40, orders: 84 },
  { day: 'Sun', revenue: 120.00, orders: 51 },
]

export const ldaMonthlySales = [
  { month: 'Nov', sales: 890, commission: 89, cogs: 445, refunds: 28 },
  { month: 'Dec', sales: 1120, commission: 112, cogs: 560, refunds: 35 },
  { month: 'Jan', sales: 780, commission: 78, cogs: 390, refunds: 22 },
  { month: 'Feb', sales: 950, commission: 95, cogs: 475, refunds: 30 },
  { month: 'Mar', sales: 1080, commission: 108, cogs: 540, refunds: 34 },
  { month: 'Apr', sales: 1240, commission: 124, cogs: 620, refunds: 38 },
]

export const ldaAlerts = [
  { id: 'ALT-001', type: 'offline' as AlertType, machine: '8825180003', location: 'Paris 10e — Gare du Nord', title: 'Machine offline since 18:12', status: 'active', date: '2026-05-06T18:12:00' },
  { id: 'ALT-002', type: 'low_stock' as AlertType, machine: '8825050300', location: 'Paris 15e', title: 'Slot A-106 — Barre Chocolat: only 2 units remain (threshold: 3)', status: 'active', date: '2026-05-07T08:30:00' },
  { id: 'ALT-003', type: 'motor_error' as AlertType, machine: '8825050300', location: 'Paris 15e', title: 'Slot B-103 Cabinet B: vend attempt failed — motor jam', status: 'active', date: '2026-05-07T09:35:00' },
  { id: 'ALT-004', type: 'expiry' as AlertType, machine: '62160463', location: 'Hamburg', title: 'Yaourt Fraise in Slot A-107 expires in 3 days', status: 'active', date: '2026-05-07T07:00:00' },
  { id: 'ALT-005', type: 'payment_error' as AlertType, machine: '8825180003', location: 'Paris 10e — Gare du Nord', title: '3 consecutive card payment failures', status: 'resolved', date: '2026-05-06T17:40:00' },
]

export const ldaUsers = [
  { id: 'U001', name: 'LDA Admin', initials: 'LA', email: 'admin@lda.fr', role: 'Admin' as UserRole, zone: 'All', assignedMachines: 3, siret: null, status: 'active' as UserStatus, lastActive: '2026-05-07T10:30:00' },
  { id: 'U002', name: 'Jean-Paul Leclerc', initials: 'JP', email: 'jp@lda.fr', role: 'Technician' as UserRole, zone: 'Route A', assignedMachines: 2, siret: null, status: 'active' as UserStatus, lastActive: '2026-05-07T08:00:00' },
  { id: 'U003', name: 'Marie Dupont', initials: 'MD', email: 'marie@dupont.fr', role: 'Producer' as UserRole, zone: 'Route A / Route B', assignedMachines: 2, siret: '38412568900034', status: 'active' as UserStatus, lastActive: '2026-05-06T14:20:00' },
  { id: 'U004', name: 'Remoteaugmentdev', initials: 'RD', email: 'remoteaugmentdev@gmail.com', role: 'Developer' as UserRole, zone: 'All', assignedMachines: 3, siret: null, status: 'pending' as UserStatus, lastActive: null },
]

export const ldaRoutes = [
  { id: 'RT-A', name: 'Route A - Paris Nord', machines: ['8825050300', '8825180003'], technician: 'Jean-Paul Leclerc', color: '#2563EB' },
  { id: 'RT-B', name: 'Route B - Hamburg', machines: ['62160463'], technician: 'Klaus Weber', color: '#10B981' },
  { id: 'RT-C', name: 'Route C - Île-de-France Est', machines: [], technician: 'Unassigned', color: '#F59E0B' },
]

export const ldaSlots = [
  { id: 101, machineId: '8825050300', cabinet: 'CabinetA', floor: 1, product: 'Jus Orange 25cl', productId: 'P001', capacity: 10, inventory: 10, price: 2.50, status: 'normal', expiry: '2026-06-01', motorStatus: 'normal', enabled: true },
  { id: 102, machineId: '8825050300', cabinet: 'CabinetA', floor: 1, product: 'Chips Barbecue', productId: 'P002', capacity: 10, inventory: 9, price: 1.80, status: 'normal', expiry: '2026-07-15', motorStatus: 'normal', enabled: true },
  { id: 103, machineId: '8825050300', cabinet: 'CabinetA', floor: 1, product: 'Sandwich Jambon', productId: 'P003', capacity: 8, inventory: 6, price: 4.20, status: 'low', expiry: '2026-05-10', motorStatus: 'error', enabled: true },
  { id: 104, machineId: '8825050300', cabinet: 'CabinetA', floor: 1, product: 'Eau Minérale 50cl', productId: 'P004', capacity: 10, inventory: 10, price: 1.20, status: 'normal', expiry: null, motorStatus: 'normal', enabled: true },
  { id: 105, machineId: '8825050300', cabinet: 'CabinetA', floor: 2, product: 'Café Noisette', productId: 'P006', capacity: 12, inventory: 11, price: 1.80, status: 'normal', expiry: '2026-08-01', motorStatus: 'normal', enabled: true },
  { id: 106, machineId: '8825050300', cabinet: 'CabinetA', floor: 2, product: 'Barre Chocolat', productId: 'P005', capacity: 15, inventory: 2, price: 1.50, status: 'critical', expiry: '2026-05-09', motorStatus: 'normal', enabled: true },
  { id: 107, machineId: '8825050300', cabinet: 'CabinetB', floor: 1, product: 'Yaourt Fraise', productId: 'P007', capacity: 8, inventory: 3, price: 2.00, status: 'low', expiry: '2026-05-10', motorStatus: 'normal', enabled: true },
  { id: 108, machineId: '8825050300', cabinet: 'CabinetB', floor: 1, product: 'Kit Stylos', productId: 'P008', capacity: 10, inventory: 9, price: 3.50, status: 'normal', expiry: null, motorStatus: 'error', enabled: false },
  { id: 201, machineId: '62160463', cabinet: 'CabinetA', floor: 1, product: 'Jus Orange 25cl', productId: 'P001', capacity: 10, inventory: 8, price: 2.50, status: 'normal', expiry: '2026-06-01', motorStatus: 'normal', enabled: true },
  { id: 202, machineId: '62160463', cabinet: 'CabinetA', floor: 1, product: 'Eau Minérale 50cl', productId: 'P004', capacity: 10, inventory: 9, price: 1.20, status: 'normal', expiry: null, motorStatus: 'normal', enabled: true },
  { id: 203, machineId: '62160463', cabinet: 'CabinetA', floor: 2, product: 'Café Noisette', productId: 'P006', capacity: 15, inventory: 11, price: 1.80, status: 'normal', expiry: '2026-08-01', motorStatus: 'normal', enabled: true },
  { id: 204, machineId: '62160463', cabinet: 'CabinetA', floor: 2, product: 'Yaourt Fraise', productId: 'P007', capacity: 8, inventory: 3, price: 2.00, status: 'low', expiry: '2026-05-10', motorStatus: 'normal', enabled: true },
]

export const ldaCashRecords = [
  { id: 'CSH-001', machineId: '8825050300', type: 'Cash Collection', amount: 124.50, technician: 'Jean-Paul Leclerc', date: '2026-05-05T14:30:00', notes: 'Weekly collection' },
  { id: 'CSH-002', machineId: '62160463', type: 'Cash Collection', amount: 87.20, technician: 'Klaus Weber', date: '2026-05-05T16:00:00', notes: '' },
  { id: 'CSH-003', machineId: '8825050300', type: 'Coin Refund', amount: -2.50, technician: 'Jean-Paul Leclerc', date: '2026-05-03T10:15:00', notes: 'Customer refund for ORD-003' },
  { id: 'CSH-004', machineId: '8825180003', type: 'Cash Collection', amount: 95.00, technician: 'Jean-Paul Leclerc', date: '2026-04-28T11:00:00', notes: 'Pre-outage collection' },
  { id: 'CSH-005', machineId: '8825050300', type: 'Cash Collection', amount: 138.70, technician: 'Jean-Paul Leclerc', date: '2026-04-21T13:45:00', notes: '' },
  { id: 'CSH-006', machineId: '62160463', type: 'Coin Refund', amount: -1.20, technician: 'Klaus Weber', date: '2026-04-20T09:30:00', notes: 'Jammed slot refund' },
]

export const ldaProductCategories = [
  { id: 'CAT-001', name: 'Snacks', productCount: 2 },
  { id: 'CAT-002', name: 'Beverages', productCount: 3 },
  { id: 'CAT-003', name: 'Fresh Food', productCount: 2 },
  { id: 'CAT-004', name: 'Office', productCount: 1 },
  { id: 'CAT-005', name: 'Personal Care', productCount: 0 },
]

export const ldaSlotOperationRecords = [
  { id: 'OP-001', machineId: '8825050300', slot: 101, product: 'Jus Orange 25cl', operation: 'Refill', oldValue: '3', newValue: '10', operator: 'Jean-Paul Leclerc', date: '2026-05-05T14:30:00' },
  { id: 'OP-002', machineId: '8825050300', slot: 102, product: 'Chips Barbecue', operation: 'Price Change', oldValue: '1.50 €', newValue: '1.80 €', operator: 'LDA Admin', date: '2026-05-03T10:00:00' },
  { id: 'OP-003', machineId: '8825050300', slot: 103, product: 'Sandwich Jambon', operation: 'Product Replaced', oldValue: 'Sandwich Thon', newValue: 'Sandwich Jambon', operator: 'LDA Admin', date: '2026-05-02T09:15:00' },
  { id: 'OP-004', machineId: '8825050300', slot: 108, product: 'Kit Stylos', operation: 'Slot Disabled', oldValue: 'Enabled', newValue: 'Disabled', operator: 'LDA Admin', date: '2026-05-01T11:30:00' },
  { id: 'OP-005', machineId: '62160463', slot: 204, product: 'Yaourt Fraise', operation: 'Expiry Date Set', oldValue: 'Not set', newValue: '2026-05-10', operator: 'Klaus Weber', date: '2026-04-28T16:00:00' },
]
