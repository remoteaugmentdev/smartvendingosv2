// Shared map types and constants — no Leaflet imports, safe for SSR
export type MapStatus = 'online' | 'low' | 'offline' | 'tech'

export interface MapMachine {
  id: string
  name: string
  location: string
  status: MapStatus
  revenueToday: number
  fill: number
  lastService: string
  lat: number
  lng: number
}

export const STATUS_COLOR: Record<MapStatus, string> = {
  online: '#10B981',
  low: '#F59E0B',
  offline: '#EF4444',
  tech: '#3B82F6',
}

export interface RouteStop {
  id: string
  name: string
  location: string
  lat: number
  lng: number
}
