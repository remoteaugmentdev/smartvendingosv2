'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { formatCurrency } from '@/utils/formatCurrency'

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

const STATUS_LABEL: Record<MapStatus, string> = {
  online: 'Online',
  low: 'Low Stock',
  offline: 'Offline',
  tech: 'Technician on-site',
}

function pin(color: string) {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1.5px rgba(15,23,42,.25)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

export default function FleetMap({
  machines,
  center,
}: {
  machines: MapMachine[]
  center: [number, number]
}) {
  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {machines.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={pin(STATUS_COLOR[m.status])}>
          <Popup>
            <div className="space-y-1 text-xs">
              <p className="text-sm font-semibold">{m.name} <span className="font-normal text-slate-400">· {m.id}</span></p>
              <p className="text-slate-500">{m.location}</p>
              <p><span className="font-medium">Status:</span> {STATUS_LABEL[m.status]}</p>
              <p><span className="font-medium">Today:</span> {formatCurrency(m.revenueToday, 2)}</p>
              <p><span className="font-medium">Fill:</span> {m.fill}%</p>
              <p><span className="font-medium">Last service:</span> {m.lastService}</p>
              <div className="flex gap-2 pt-1">
                <a href={`/machines/${m.id}`} className="font-medium text-blue-600 hover:underline">Open Machine</a>
                <span className="text-blue-600">· Add to Trip</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
