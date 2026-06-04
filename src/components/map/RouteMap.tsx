'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'

export interface RouteStop {
  id: string
  name: string
  location: string
  lat: number
  lng: number
}

function numberedIcon(n: number) {
  return L.divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#2563EB;color:#fff;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 0 0 1.5px rgba(15,23,42,.25)">${n}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

export default function RouteMap({ stops, center }: { stops: RouteStop[]; center: [number, number] }) {
  const line = stops.map((s) => [s.lat, s.lng] as [number, number])

  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Polyline positions={line} pathOptions={{ color: '#2563EB', weight: 4, opacity: 0.7, dashArray: '6 8' }} />
      {stops.map((s, i) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={numberedIcon(i + 1)}>
          <Popup>
            <div className="text-xs">
              <p className="text-sm font-semibold">Stop {i + 1}: {s.name}</p>
              <p className="text-slate-500">{s.location}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
