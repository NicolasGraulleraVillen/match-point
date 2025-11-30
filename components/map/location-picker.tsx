"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

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

import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

interface LocationPickerProps {
  location: { lat: number; lng: number; address: string }
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void
}

function MapClickHandler({ onLocationChange, currentAddress }: { onLocationChange: (loc: { lat: number; lng: number; address: string }) => void; currentAddress: string }) {
  const { useMapEvents } = require("react-leaflet")
  
  useMapEvents({
    click(e: any) {
      const newLat = e.latlng.lat
      const newLng = e.latlng.lng
      
      // Reverse geocoding (simplified - in production use a geocoding service)
      const address = currentAddress || `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`
      onLocationChange({ lat: newLat, lng: newLng, address })
    },
  })
  
  return null
}

function LocationMarker({ location }: { location: { lat: number; lng: number; address: string } }) {
  return <Marker position={[location.lat, location.lng]} />
}

export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationChange={onLocationChange} currentAddress={location.address} />
        <LocationMarker location={location} />
      </MapContainer>
    </div>
  )
}
