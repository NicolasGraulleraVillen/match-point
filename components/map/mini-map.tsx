"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Match } from "@/types"

// Fix for default markers in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

interface MiniMapProps {
  match: Match
  className?: string
}

export function MiniMap({ match, className = "" }: MiniMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !match.location) {
    return (
      <div className={`relative h-32 w-full overflow-hidden rounded-lg bg-muted ${className}`}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-xs text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  const getSportIcon = (sport: string) => {
    const size = 24
    const sportKey = sport.toLowerCase()

    let svgIcon = ""
    let bgColor = "#6B7280"

    if (sportKey.includes("fútbol") || sportKey.includes("football")) {
      bgColor = "#3B82F6"
      svgIcon = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`
    } else if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) {
      bgColor = "#EF4444"
      svgIcon = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><path d="M17.09 11l2.5-2.5-1.41-1.41-2.5 2.5-2.5-2.5-1.41 1.41 2.5 2.5-2.5 2.5 1.41 1.41 2.5-2.5 2.5 2.5 1.41-1.41-2.5-2.5zM6.91 11l-2.5-2.5 1.41-1.41 2.5 2.5 2.5-2.5 1.41 1.41-2.5 2.5 2.5 2.5-1.41 1.41-2.5-2.5-2.5 2.5-1.41-1.41 2.5-2.5z"/></svg>`
    } else if (sportKey.includes("tenis") || sportKey.includes("tennis")) {
      bgColor = "#10B981"
      svgIcon = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="12" cy="12" r="10" fill="white"/></svg>`
    } else if (sportKey.includes("pádel") || sportKey.includes("padel")) {
      bgColor = "#F59E0B"
      svgIcon = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
    }

    return L.divIcon({
      className: "custom-marker-mini",
      html: `<div style="background: ${bgColor}; border-radius: 50%; padding: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-center; width: ${size + 8}px; height: ${size + 8}px;">${svgIcon}</div>`,
      iconSize: [size + 8, size + 8],
      iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    })
  }

  return (
    <div className={`relative h-32 w-full overflow-hidden rounded-lg border ${className}`}>
      <MapContainer
        center={[match.location.lat, match.location.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[match.location.lat, match.location.lng]}
          icon={getSportIcon(match.sport)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{match.sport}</p>
              <p className="text-muted-foreground">{match.location.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
