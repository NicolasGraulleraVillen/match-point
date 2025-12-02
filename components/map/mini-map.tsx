"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Match } from "@/types";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

let LRef: typeof import("leaflet") | null = null;

if (typeof window !== "undefined") {
  // Cargar Leaflet solo en cliente
  LRef = require("leaflet");
  require("leaflet/dist/leaflet.css");

  // Fix para los iconos por defecto en Next.js
  delete (LRef.Icon.Default.prototype as any)._getIconUrl;
  LRef.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface MiniMapProps {
  match: Match;
  className?: string;
}

export function MiniMap({ match, className = "" }: MiniMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    );
  }

  const getSportIcon = (sport: string) => {
    if (!LRef) return undefined as any;

    // Un poco más pequeño que en el mapa grande
    const size = 20;
    const sportKey = sport.toLowerCase();

    let iconUrl = "/icons/default.png";

    if (sportKey.includes("fútbol") || sportKey.includes("football")) {
      iconUrl = "/icons/football.png";
    } else if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) {
      iconUrl = "/icons/basketball.png";
    } else if (sportKey.includes("tenis") || sportKey.includes("tennis")) {
      iconUrl = "/icons/tennis.png";
    } else if (sportKey.includes("pádel") || sportKey.includes("padel")) {
      iconUrl = "/icons/padel.png";
    }

    return LRef.divIcon({
      className: "custom-marker-mini",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="
            width:${size}px;
            height:${size}px;
            border-radius:9999px;
            overflow:hidden;
            box-shadow:0 2px 6px rgba(15,23,42,0.45);
            background:#ffffff;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img src="${iconUrl}" style="width:${size - 4}px;height:${size - 4}px;object-fit:contain;" />
          </div>
          <div style="
            width:6px;
            height:6px;
            border-radius:9999px;
            background:white;
            opacity:0.9;
            margin-top:2px;
          "></div>
        </div>
      `,
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 8],
    });
  };
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
        <Marker position={[match.location.lat, match.location.lng]} icon={getSportIcon(match.sport)}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{match.sport}</p>
              <p className="text-muted-foreground">{match.location.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
