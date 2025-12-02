"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Match } from "@/types";

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

let LRef: typeof import("leaflet") | null = null;

if (typeof window !== "undefined") {
  // Cargar Leaflet solo en cliente
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LRef = require("leaflet");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("leaflet/dist/leaflet.css");

  // Fix para los iconos por defecto en Next.js
  delete (LRef.Icon.Default.prototype as any)._getIconUrl;
  LRef.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}
interface MatchMapProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
  center?: [number, number];
  zoom?: number;
  teams?: Array<{ id: string; name: string; sport: string; location?: { lat: number; lng: number; address: string } }>;
}

export function MatchMap({
  matches,
  onMatchSelect,
  center = [40.4168, -3.7038],
  zoom = 13,
  teams = [],
}: MatchMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const getSportIcon = (sport: string, isTeam = false) => {
    if (!LRef) return undefined as any;

    // Iconos un poco más pequeños
    const size = isTeam ? 32 : 24;
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

    // Usamos divIcon para poder añadir el circulito blanco debajo
    return LRef.divIcon({
      className: "custom-marker",
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
            width:8px;
            height:8px;
            border-radius:9999px;
            background:white;
            opacity:0.9;
            margin-top:2px;
          "></div>
        </div>
      `,
      iconSize: [size, size + 10],
      iconAnchor: [size / 2, size + 10], // "punta" en el circulito blanco
      popupAnchor: [0, -(size / 2)],
    });
  };

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
                onMatchSelect(match);
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
          if (!team.location) return null;
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
          );
        })}
      </MapContainer>
    </div>
  );
}
