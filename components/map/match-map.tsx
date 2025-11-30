"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Match } from "@/types"

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

interface MatchMapProps {
  matches: Match[]
  onMatchSelect: (match: Match) => void
  center?: [number, number]
  zoom?: number
  teams?: Array<{ id: string; name: string; sport: string; location?: { lat: number; lng: number; address: string } }>
}

export function MatchMap({ matches, onMatchSelect, center = [40.4168, -3.7038], zoom = 13, teams = [] }: MatchMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  // Create custom icons for different sports using SVG
  const getSportIcon = (sport: string, isTeam = false) => {
    const size = isTeam ? 32 : 28
    const sportKey = sport.toLowerCase()
    
    let svgIcon = ""
    
    if (sportKey.includes("fútbol") || sportKey.includes("football")) {
      svgIcon = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="#22c55e" />
        <path d="M12 2 L13.5 7 L19 7.5 L14.5 11 L16 16.5 L12 13.5 L8 16.5 L9.5 11 L5 7.5 L10.5 7 Z" 
              fill="white" opacity="0.3" stroke="white" stroke-width="1" stroke-linejoin="round" />
        <path d="M12 2 L13.5 7 M19 7.5 L14.5 11 M16 16.5 L12 13.5 M8 16.5 L9.5 11 M5 7.5 L10.5 7" 
              stroke="white" stroke-width="1.5" stroke-linecap="round" />
      </svg>`
    } else if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) {
      svgIcon = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="#ef4444" />
        <path d="M12 2 C14 8, 14 16, 12 22" stroke="white" stroke-width="1.5" fill="none" />
        <path d="M12 2 C10 8, 10 16, 12 22" stroke="white" stroke-width="1.5" fill="none" />
        <path d="M2 12 C8 10, 16 10, 22 12" stroke="white" stroke-width="1.5" fill="none" />
        <path d="M2 12 C8 14, 16 14, 22 12" stroke="white" stroke-width="1.5" fill="none" />
        <circle cx="12" cy="12" r="2" fill="white" opacity="0.5" />
      </svg>`
    } else if (sportKey.includes("tenis") || sportKey.includes("tennis")) {
      svgIcon = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="5.5" stroke="white" stroke-width="2" fill="#3b82f6" />
        <path d="M5 5 L11 11" stroke="white" stroke-width="1" />
        <path d="M5 11 L11 5" stroke="white" stroke-width="1" />
        <path d="M13 13 L19.5 19.5" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="20.5" cy="20.5" r="2" fill="white" />
      </svg>`
    } else if (sportKey.includes("pádel") || sportKey.includes("padel")) {
      svgIcon = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="8" height="14" rx="2" stroke="white" stroke-width="2" fill="#f59e0b" />
        <line x1="5" y1="6" x2="9" y2="6" stroke="white" stroke-width="0.5" />
        <line x1="5" y1="9" x2="9" y2="9" stroke="white" stroke-width="0.5" />
        <line x1="5" y1="12" x2="9" y2="12" stroke="white" stroke-width="0.5" />
        <line x1="5" y1="15" x2="9" y2="15" stroke="white" stroke-width="0.5" />
        <path d="M15 3 L21 3 L21 17 L15 17" stroke="white" stroke-width="2" stroke-linecap="round" />
        <circle cx="7" cy="19.5" r="1.2" fill="white" />
        <circle cx="18" cy="20.5" r="1.5" fill="white" />
      </svg>`
    } else {
      // Default icon
      svgIcon = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="#6366f1" />
      </svg>`
    }

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background: white; border-radius: 50%; padding: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">${svgIcon}</div>`,
      iconSize: [size + 4, size + 4],
      iconAnchor: [(size + 4) / 2, (size + 4) / 2],
    })
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {matches.map((match) => (
          <Marker
            key={match.id}
            position={[match.location.lat, match.location.lng]}
            icon={getSportIcon(match.sport)}
            eventHandlers={{
              click: () => {
                onMatchSelect(match)
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{match.sport}</p>
                <p className="text-muted-foreground">{match.distance}m</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {teams.map((team) => {
          if (!team.location) return null
          return (
            <Marker
              key={`team-${team.id}`}
              position={[team.location.lat, team.location.lng]}
              icon={getSportIcon(team.sport, true)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-muted-foreground">{team.sport}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

