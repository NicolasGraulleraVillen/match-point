"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

let LRef: typeof import("leaflet") | null = null;

// Fix for default marker icons - sólo en cliente
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-var-requires
  LRef = require("leaflet");
  // eslint-disable-next-line no-var-requires
  require("leaflet/dist/leaflet.css");

  delete (LRef.Icon.Default.prototype as any)._getIconUrl;
  LRef.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface LocationPickerProps {
  location: { lat: number; lng: number; address: string };
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  interactive?: boolean;
}

function MapClickHandler({
  onLocationChange,
  currentAddress,
}: {
  onLocationChange: (loc: { lat: number; lng: number; address: string }) => void;
  currentAddress: string;
}) {
  const { useMapEvents } = require("react-leaflet");

  useMapEvents({
    click(e: any) {
      const newLat = e.latlng.lat;
      const newLng = e.latlng.lng;

      // Reverse geocoding (simplified - in production use a geocoding service)
      const address = currentAddress || `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`;
      onLocationChange({ lat: newLat, lng: newLng, address });
    },
  });

  return null;
}

function LocationMarker({ location }: { location: { lat: number; lng: number; address: string } }) {
  return <Marker position={[location.lat, location.lng]} />;
}

export function LocationPicker({ location, onLocationChange, interactive = true }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    );
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg">
      <MapContainer
        key={`${location.lat}-${location.lng}`}
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <MapClickHandler onLocationChange={onLocationChange} currentAddress={location.address} />}{" "}
        <LocationMarker location={location} />
      </MapContainer>
    </div>
  );
}
