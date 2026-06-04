export type MachineStatus = 'online' | 'offline' | 'warning'
export type OrderStatus = 'completed' | 'refunded' | 'failed'
export type AlertType = 'offline' | 'low_stock' | 'motor_error' | 'expiry' | 'payment_error'
export type UserRole = 'Admin' | 'Technician' | 'Producer' | 'Developer'
export type UserStatus = 'active' | 'pending' | 'inactive'
export type MappingStatus = 'verified' | 'pending' | 'unmapped'
export type EslStatus = 'synced' | 'out_of_sync' | 'never_pushed' | 'push_failed'

export const ldaMachines = [
  {
    id: 'CD001', name: 'Cold drink multiplace',
    location: 'Crystal Clean — 1234 W. Lindsey St, Norman, OK', model: 'Crane 167',
    status: 'online' as MachineStatus, route: 'Route A — North',
    revenueToday: 124.50, capacity: 950, inventory: 836,
    shortageRate: 12.0, shortageThreshold: 15,
    revenueMonthly: [1480, 1520, 1610, 1740, 1680, 1820],
    lastPing: '2026-05-07T10:42:00', powerConsumption: 10.67,
    cabinets: 3, totalSlots: 36, expiryDate: '2027-03-01',
  },
  {
    id: 'CD002', name: 'Cold drink employee',
    location: 'Crystal Clean — 1234 W. Lindsey St, Norman, OK', model: 'Crane 167',
    status: 'online' as MachineStatus, route: 'Route A — North',
    revenueToday: 96.20, capacity: 640, inventory: 461,
    shortageRate: 28.0, shortageThreshold: 15,
    revenueMonthly: [980, 1020, 1100, 1180, 1140, 1240],
    lastPing: '2026-05-07T10:38:00', powerConsumption: 7.43,
    cabinets: 2, totalSlots: 24, expiryDate: '2027-06-01',
  },
  {
    id: 'CD003', name: 'Cold drink multiplex',
    location: 'Crystal Clean — 1234 W. Lindsey St, Norman, OK', model: 'Wittern 3589',
    status: 'offline' as MachineStatus, route: 'Route A — North',
    revenueToday: 0, capacity: 1280, inventory: 0,
    shortageRate: 100, shortageThreshold: 15,
    revenueMonthly: [1100, 980, 1050, 0, 1200, 480],
    lastPing: '2026-05-06T18:12:00', powerConsumption: 0,
    cabinets: 3, totalSlots: 48, expiryDate: '2026-12-01',
  },
  {
    id: 'WF001', name: 'Wells Fargo Snack',
    location: 'Wells Fargo Bank — 127 Elm Dr, Edmond, OK', model: 'Micron VMGZ-WM22T2',
    status: 'online' as MachineStatus, route: 'Route C — Central',
    revenueToday: 188.40, capacity: 720, inventory: 324,
    shortageRate: 45.0, shortageThreshold: 15,
    revenueMonthly: [1820, 1900, 2010, 2080, 2110, 2140],
    lastPing: '2026-05-07T10:50:00', powerConsumption: 6.20,
    cabinets: 2, totalSlots: 30, expiryDate: '2027-04-01',
  },
  {
    id: 'WF002', name: 'Wells Fargo Drink',
    location: 'Wells Fargo Bank — 127 Elm Dr, Edmond, OK', model: 'Crane 167',
    status: 'warning' as MachineStatus, route: 'Route C — Central',
    revenueToday: 142.10, capacity: 600, inventory: 186,
    shortageRate: 69.0, shortageThreshold: 15,
    revenueMonthly: [1620, 1700, 1810, 1880, 1900, 1920],
    lastPing: '2026-05-07T10:44:00', powerConsumption: 9.10,
    cabinets: 2, totalSlots: 28, expiryDate: '2027-02-01',
  },
  {
    id: 'WF003', name: 'Wells Fargo Combo',
    location: 'Wells Fargo Bank — 127 Elm Dr, Edmond, OK', model: 'Jofemar G23',
    status: 'online' as MachineStatus, route: 'Route C — Central',
    revenueToday: 110.70, capacity: 880, inventory: 590,
    shortageRate: 33.0, shortageThreshold: 15,
    revenueMonthly: [1480, 1520, 1560, 1610, 1650, 1680],
    lastPing: '2026-05-07T10:31:00', powerConsumption: 8.05,
    cabinets: 3, totalSlots: 40, expiryDate: '2027-05-01',
  },
  {
    id: 'IA001', name: 'Insurance Agency',
    location: 'Insurance Agency — 503 Eastern Pkwy, Tulsa, OK', model: 'Micron VMGZ-WM18T1',
    status: 'online' as MachineStatus, route: 'Route B — South',
    revenueToday: 78.90, capacity: 520, inventory: 426,
    shortageRate: 18.0, shortageThreshold: 15,
    revenueMonthly: [880, 910, 940, 960, 970, 980],
    lastPing: '2026-05-07T10:22:00', powerConsumption: 5.80,
    cabinets: 2, totalSlots: 22, expiryDate: '2027-07-01',
  },
  {
    id: 'OR001', name: 'Omega Retreat Main',
    location: 'Omega Retreat — 905 S Highway 152, Mustang, OK', model: 'Crane 167',
    status: 'online' as MachineStatus, route: 'Route B — South',
    revenueToday: 134.00, capacity: 760, inventory: 418,
    shortageRate: 45.0, shortageThreshold: 15,
    revenueMonthly: [1320, 1390, 1450, 1490, 1510, 1540],
    lastPing: '2026-05-07T10:18:00', powerConsumption: 7.90,
    cabinets: 2, totalSlots: 32, expiryDate: '2027-01-01',
  },
]

export const ldaProducts = [
  { id: 'P001', name: 'Coca-Cola 12 oz can', category: 'Beverages', price: 1.25,
    barcode: '049000028904', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 12, capacity: 50, reorderLevel: 50, totalSales: 446, totalRevenue: 892.00,
    machines: ['CD001', 'WF002'], aisleCode: 'A-01' },
  { id: 'P002', name: 'Mountain Dew 12 oz can', category: 'Beverages', price: 1.25,
    barcode: '012000001529', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 22, capacity: 50, reorderLevel: 40, totalSales: 405, totalRevenue: 810.00,
    machines: ['CD001', 'CD002'], aisleCode: 'A-02' },
  { id: 'P003', name: 'Pepsi 12 oz can', category: 'Beverages', price: 1.25,
    barcode: '012000800834', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 31, capacity: 50, reorderLevel: 40, totalSales: 288, totalRevenue: 360.00,
    machines: ['CD002'], aisleCode: 'A-03' },
  { id: 'P004', name: '3 Musketeers Candy Bar', category: 'Snacks', price: 1.50,
    barcode: '040000004356', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 28, capacity: 30, reorderLevel: 30, totalSales: 360, totalRevenue: 540.00,
    machines: ['WF001'], aisleCode: 'B-01' },
  { id: 'P005', name: 'Doritos Nacho Cheese', category: 'Snacks', price: 1.75,
    barcode: '028400090360', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 63, capacity: 100, reorderLevel: 100, totalSales: 270, totalRevenue: 486.00,
    machines: ['WF001', 'CD003'], aisleCode: 'B-02' },
  { id: 'P006', name: 'Fritos Corn Chips', category: 'Snacks', price: 1.75,
    barcode: '028400090391', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 57, capacity: 100, reorderLevel: 100, totalSales: 278, totalRevenue: 418.00,
    machines: ['WF001'], aisleCode: 'B-03' },
  { id: 'P007', name: "Wrigley's Doublemint Gum", category: 'Snacks', price: 0.75,
    barcode: '022000010292', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 14, capacity: 20, reorderLevel: 20, totalSales: 120, totalRevenue: 90.00,
    machines: ['WF003'], aisleCode: 'B-04' },
  { id: 'P008', name: 'Snickers Bar', category: 'Snacks', price: 1.50,
    barcode: '040000001041', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 26, capacity: 30, reorderLevel: 30, totalSales: 198, totalRevenue: 297.00,
    machines: ['IA001', 'WF001'], aisleCode: 'B-05' },
  { id: 'P009', name: 'Tropicana OJ 11.5 oz', category: 'Beverages', price: 2.25,
    barcode: '048500208434', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 9, capacity: 20, reorderLevel: 20, totalSales: 88, totalRevenue: 198.00,
    machines: ['WF003'], aisleCode: 'A-04' },
  { id: 'P010', name: 'Red Bull 8.4 oz', category: 'Beverages', price: 3.50,
    barcode: '611269993056', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 5, capacity: 15, reorderLevel: 15, totalSales: 142, totalRevenue: 497.00,
    machines: ['OR001'], aisleCode: 'A-05' },
  { id: 'P011', name: 'Nature Valley Granola Bar', category: 'Snacks', price: 1.75,
    barcode: '016000275287', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 20, capacity: 25, reorderLevel: 25, totalSales: 96, totalRevenue: 168.00,
    machines: ['OR001'], aisleCode: 'B-06' },
  { id: 'P012', name: "Lay's Classic Chips", category: 'Snacks', price: 1.75,
    barcode: '028400315586', siret: null, producer: null,
    status: 'active', mappingStatus: 'verified' as MappingStatus,
    eslStatus: 'synced' as EslStatus, eslLastPushed: '2026-05-01T09:00:00',
    stock: 48, capacity: 80, reorderLevel: 80, totalSales: 204, totalRevenue: 357.00,
    machines: ['IA001'], aisleCode: 'B-07' },
]

// Suppliers (operator's vendors)
export const ldaProducers = [
  { id: 'SUP001', name: 'McLane Foodservice', siret: '',
    machinesAssigned: 0, productsCount: 31, status: 'active', email: 'orders@mclane.com' },
  { id: 'SUP002', name: "Norman Sam's Club", siret: '',
    machinesAssigned: 0, productsCount: 12, status: 'active', email: 'business@samsclub.com' },
  { id: 'SUP003', name: 'Walmart Supercenter', siret: '',
    machinesAssigned: 0, productsCount: 24, status: 'active', email: 'wholesale@walmart.com' },
]

export const ldaOrders = [
  { id: 'ORD-001', product: 'Coca-Cola 12 oz can', deviceId: 'CD001', slot: 'A-01', amount: 1.25, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T09:12:00' },
  { id: 'ORD-002', product: 'Doritos Nacho Cheese', deviceId: 'WF001', slot: 'B-02', amount: 1.75, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T09:18:00' },
  { id: 'ORD-003', product: 'Red Bull 8.4 oz', deviceId: 'OR001', slot: 'A-05', amount: 3.50, payment: 'card', status: 'refunded' as OrderStatus, refund: 'refunded', siret: null, date: '2026-05-07T09:35:00' },
  { id: 'ORD-004', product: 'Pepsi 12 oz can', deviceId: 'CD002', slot: 'A-03', amount: 1.25, payment: 'cash', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T09:52:00' },
  { id: 'ORD-005', product: 'Snickers Bar', deviceId: 'IA001', slot: 'B-05', amount: 1.50, payment: 'card', status: 'failed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T10:04:00' },
  { id: 'ORD-006', product: '3 Musketeers Candy Bar', deviceId: 'WF001', slot: 'B-01', amount: 1.50, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T10:21:00' },
  { id: 'ORD-007', product: 'Tropicana OJ 11.5 oz', deviceId: 'WF003', slot: 'A-04', amount: 2.25, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T10:33:00' },
  { id: 'ORD-008', product: 'Coca-Cola 12 oz can', deviceId: 'CD001', slot: 'A-01', amount: 1.25, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-07T10:45:00' },
  { id: 'ORD-009', product: "Lay's Classic Chips", deviceId: 'IA001', slot: 'B-07', amount: 1.75, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-06T14:20:00' },
  { id: 'ORD-010', product: 'Mountain Dew 12 oz can', deviceId: 'CD002', slot: 'A-02', amount: 1.25, payment: 'cash', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-06T15:10:00' },
  { id: 'ORD-011', product: 'Nature Valley Granola Bar', deviceId: 'OR001', slot: 'B-06', amount: 1.75, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-06T11:05:00' },
  { id: 'ORD-012', product: 'Fritos Corn Chips', deviceId: 'WF001', slot: 'B-03', amount: 1.75, payment: 'card', status: 'refunded' as OrderStatus, refund: 'refunded', siret: null, date: '2026-05-05T16:40:00' },
  { id: 'ORD-013', product: 'Mountain Dew 12 oz can', deviceId: 'CD001', slot: 'A-02', amount: 1.25, payment: 'qr', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-05T09:22:00' },
  { id: 'ORD-014', product: 'Coca-Cola 12 oz can', deviceId: 'WF002', slot: 'A-01', amount: 1.25, payment: 'card', status: 'completed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-04T12:15:00' },
  { id: 'ORD-015', product: 'Snickers Bar', deviceId: 'WF001', slot: 'B-05', amount: 1.50, payment: 'cash', status: 'failed' as OrderStatus, refund: 'none', siret: null, date: '2026-05-04T17:30:00' },
]

export const ldaWeeklyRevenue = [
  { day: 'Mon', revenue: 642.50, orders: 458 },
  { day: 'Tue', revenue: 718.20, orders: 471 },
  { day: 'Wed', revenue: 655.80, orders: 464 },
  { day: 'Thu', revenue: 811.70, orders: 489 },
  { day: 'Fri', revenue: 943.90, orders: 502 },
  { day: 'Sat', revenue: 598.40, orders: 384 },
  { day: 'Sun', revenue: 420.00, orders: 251 },
]

export const ldaMonthlySales = [
  { month: 'Nov', sales: 12890, commission: 920, cogs: 6445, refunds: 228 },
  { month: 'Dec', sales: 14120, commission: 1010, cogs: 7060, refunds: 305 },
  { month: 'Jan', sales: 11780, commission: 860, cogs: 5890, refunds: 222 },
  { month: 'Feb', sales: 13950, commission: 995, cogs: 6975, refunds: 300 },
  { month: 'Mar', sales: 16080, commission: 1108, cogs: 8040, refunds: 334 },
  { month: 'Apr', sales: 18430, commission: 1240, cogs: 8240, refunds: 320 },
]

export const ldaAlerts = [
  { id: 'ALT-001', type: 'offline' as AlertType, machine: 'CD003', location: 'Crystal Clean, Norman', title: 'Machine offline since 18:12', status: 'active', date: '2026-05-06T18:12:00' },
  { id: 'ALT-002', type: 'low_stock' as AlertType, machine: 'WF002', location: 'Wells Fargo Bank, Edmond', title: 'Slot A-01 — Coca-Cola: only 2 units remain (threshold: 15)', status: 'active', date: '2026-05-07T08:30:00' },
  { id: 'ALT-003', type: 'motor_error' as AlertType, machine: 'WF001', location: 'Wells Fargo Bank, Edmond', title: 'Slot B-07 Cabinet B: vend attempt failed — motor jam', status: 'active', date: '2026-05-07T09:35:00' },
  { id: 'ALT-004', type: 'expiry' as AlertType, machine: 'OR001', location: 'Omega Retreat, Mustang', title: 'Nature Valley Granola Bar in Slot B-06 expires in 3 days', status: 'active', date: '2026-05-07T07:00:00' },
  { id: 'ALT-005', type: 'payment_error' as AlertType, machine: 'CD003', location: 'Crystal Clean, Norman', title: '3 consecutive card payment failures', status: 'resolved', date: '2026-05-06T17:40:00' },
]

export const ldaUsers = [
  { id: 'U001', name: 'Alex Johnson', initials: 'AJ', email: 'alex@peakvending.com', role: 'Admin' as UserRole, zone: 'All', assignedMachines: 8, siret: null, status: 'active' as UserStatus, lastActive: '2026-05-07T10:30:00' },
  { id: 'U002', name: 'John Martinez', initials: 'JM', email: 'john@peakvending.com', role: 'Technician' as UserRole, zone: 'Route A — North', assignedMachines: 3, siret: null, status: 'active' as UserStatus, lastActive: '2026-05-07T08:00:00' },
  { id: 'U003', name: 'Maria Chen', initials: 'MC', email: 'maria@peakvending.com', role: 'Technician' as UserRole, zone: 'Route B — South', assignedMachines: 2, siret: null, status: 'active' as UserStatus, lastActive: '2026-05-06T14:20:00' },
  { id: 'U004', name: 'Remoteaugmentdev', initials: 'RD', email: 'remoteaugmentdev@gmail.com', role: 'Developer' as UserRole, zone: 'All', assignedMachines: 8, siret: null, status: 'pending' as UserStatus, lastActive: null },
]

export const ldaRoutes = [
  { id: 'RT-A', name: 'Route A — North', machines: ['CD001', 'CD002', 'CD003'], technician: 'John Martinez', color: '#2563EB' },
  { id: 'RT-B', name: 'Route B — South', machines: ['IA001', 'OR001'], technician: 'Maria Chen', color: '#10B981' },
  { id: 'RT-C', name: 'Route C — Central', machines: ['WF001', 'WF002', 'WF003'], technician: 'Bob Williams', color: '#F59E0B' },
]

export const ldaSlots = [
  { id: 101, machineId: 'CD001', cabinet: 'CabinetA', floor: 1, product: 'Coca-Cola 12 oz can', productId: 'P001', capacity: 10, inventory: 10, price: 1.25, status: 'normal', expiry: '2026-09-01', motorStatus: 'normal', enabled: true },
  { id: 102, machineId: 'CD001', cabinet: 'CabinetA', floor: 1, product: 'Mountain Dew 12 oz can', productId: 'P002', capacity: 10, inventory: 9, price: 1.25, status: 'normal', expiry: '2026-09-15', motorStatus: 'normal', enabled: true },
  { id: 103, machineId: 'CD001', cabinet: 'CabinetA', floor: 1, product: 'Pepsi 12 oz can', productId: 'P003', capacity: 8, inventory: 6, price: 1.25, status: 'low', expiry: '2026-08-10', motorStatus: 'error', enabled: true },
  { id: 104, machineId: 'CD001', cabinet: 'CabinetA', floor: 1, product: 'Tropicana OJ 11.5 oz', productId: 'P009', capacity: 10, inventory: 10, price: 2.25, status: 'normal', expiry: '2026-07-01', motorStatus: 'normal', enabled: true },
  { id: 105, machineId: 'CD001', cabinet: 'CabinetA', floor: 2, product: 'Red Bull 8.4 oz', productId: 'P010', capacity: 12, inventory: 11, price: 3.50, status: 'normal', expiry: '2026-12-01', motorStatus: 'normal', enabled: true },
  { id: 106, machineId: 'CD001', cabinet: 'CabinetA', floor: 2, product: '3 Musketeers Candy Bar', productId: 'P004', capacity: 15, inventory: 2, price: 1.50, status: 'critical', expiry: '2026-06-09', motorStatus: 'normal', enabled: true },
  { id: 107, machineId: 'CD001', cabinet: 'CabinetB', floor: 1, product: 'Snickers Bar', productId: 'P008', capacity: 8, inventory: 3, price: 1.50, status: 'low', expiry: '2026-06-10', motorStatus: 'normal', enabled: true },
  { id: 108, machineId: 'CD001', cabinet: 'CabinetB', floor: 1, product: "Lay's Classic Chips", productId: 'P012', capacity: 10, inventory: 9, price: 1.75, status: 'normal', expiry: '2026-07-20', motorStatus: 'error', enabled: false },
  { id: 201, machineId: 'WF001', cabinet: 'CabinetA', floor: 1, product: 'Doritos Nacho Cheese', productId: 'P005', capacity: 10, inventory: 8, price: 1.75, status: 'normal', expiry: '2026-08-01', motorStatus: 'normal', enabled: true },
  { id: 202, machineId: 'WF001', cabinet: 'CabinetA', floor: 1, product: 'Fritos Corn Chips', productId: 'P006', capacity: 10, inventory: 9, price: 1.75, status: 'normal', expiry: '2026-08-15', motorStatus: 'normal', enabled: true },
  { id: 203, machineId: 'WF001', cabinet: 'CabinetA', floor: 2, product: '3 Musketeers Candy Bar', productId: 'P004', capacity: 15, inventory: 11, price: 1.50, status: 'normal', expiry: '2026-09-01', motorStatus: 'normal', enabled: true },
  { id: 204, machineId: 'WF001', cabinet: 'CabinetA', floor: 2, product: 'Snickers Bar', productId: 'P008', capacity: 8, inventory: 3, price: 1.50, status: 'low', expiry: '2026-06-10', motorStatus: 'normal', enabled: true },
]

export const ldaCashRecords = [
  { id: 'CSH-001', machineId: 'CD001', type: 'Cash Collection', amount: 124.50, technician: 'John Martinez', date: '2026-05-05T14:30:00', notes: 'Weekly collection' },
  { id: 'CSH-002', machineId: 'WF001', type: 'Cash Collection', amount: 188.40, technician: 'Bob Williams', date: '2026-05-05T16:00:00', notes: '' },
  { id: 'CSH-003', machineId: 'CD001', type: 'Coin Refund', amount: -3.50, technician: 'John Martinez', date: '2026-05-03T10:15:00', notes: 'Customer refund for ORD-003' },
  { id: 'CSH-004', machineId: 'CD003', type: 'Cash Collection', amount: 95.00, technician: 'John Martinez', date: '2026-04-28T11:00:00', notes: 'Pre-outage collection' },
  { id: 'CSH-005', machineId: 'CD001', type: 'Cash Collection', amount: 138.70, technician: 'John Martinez', date: '2026-04-21T13:45:00', notes: '' },
  { id: 'CSH-006', machineId: 'WF001', type: 'Coin Refund', amount: -1.75, technician: 'Bob Williams', date: '2026-04-20T09:30:00', notes: 'Jammed slot refund' },
]

export const ldaProductCategories = [
  { id: 'CAT-001', name: 'Snacks', productCount: 8 },
  { id: 'CAT-002', name: 'Beverages', productCount: 4 },
  { id: 'CAT-003', name: 'Fresh Food', productCount: 0 },
  { id: 'CAT-004', name: 'Hot Drink', productCount: 0 },
  { id: 'CAT-005', name: 'Health & Beauty', productCount: 0 },
]

export const ldaSlotOperationRecords = [
  { id: 'OP-001', machineId: 'CD001', slot: 101, product: 'Coca-Cola 12 oz can', operation: 'Refill', oldValue: '3', newValue: '10', operator: 'John Martinez', date: '2026-05-05T14:30:00' },
  { id: 'OP-002', machineId: 'CD001', slot: 102, product: 'Mountain Dew 12 oz can', operation: 'Price Change', oldValue: '$1.00', newValue: '$1.25', operator: 'Alex Johnson', date: '2026-05-03T10:00:00' },
  { id: 'OP-003', machineId: 'CD001', slot: 103, product: 'Pepsi 12 oz can', operation: 'Product Replaced', oldValue: 'Diet Pepsi', newValue: 'Pepsi 12 oz can', operator: 'Alex Johnson', date: '2026-05-02T09:15:00' },
  { id: 'OP-004', machineId: 'CD001', slot: 108, product: "Lay's Classic Chips", operation: 'Slot Disabled', oldValue: 'Enabled', newValue: 'Disabled', operator: 'Alex Johnson', date: '2026-05-01T11:30:00' },
  { id: 'OP-005', machineId: 'WF001', slot: 204, product: 'Snickers Bar', operation: 'Expiry Date Set', oldValue: 'Not set', newValue: '2026-06-10', operator: 'Bob Williams', date: '2026-04-28T16:00:00' },
]
