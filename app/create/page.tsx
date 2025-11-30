"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { Toast } from "@/components/ui/toast"
import { createMatch, getTeams } from "@/lib/api-client"
import usersData from "@/data/users.json"
import { Team } from "@/types"
import { LocationPicker } from "@/components/map/location-picker"

export default function CreatePage() {
  const router = useRouter()
  const { isLoggedIn, loading, currentUser } = useAuth()
  const [sport, setSport] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [players, setPlayers] = useState("")
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [location, setLocation] = useState({ lat: 40.4168, lng: -3.7038, address: "" })
  const [distance, setDistance] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [isTeamMatch, setIsTeamMatch] = useState(false)

  const isTeamSport = sport === "Fútbol" || sport === "Baloncesto"

  useEffect(() => {
    if (isLoggedIn && isTeamSport && currentUser) {
      loadUserTeams()
    }
  }, [isLoggedIn, isTeamSport, currentUser])

  const loadUserTeams = async () => {
    try {
      const allTeams = await getTeams()
      const userTeams = allTeams.filter(t => 
        t.members.includes(currentUser!.id) && t.sport === sport
      )
      setTeams(userTeams)
      if (userTeams.length > 0) {
        setSelectedTeamId(userTeams[0].id)
      }
    } catch (error) {
      console.error("Error loading teams:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!currentUser) {
        throw new Error("Usuario no autenticado")
      }

      const user = usersData.find(u => u.id === currentUser.id)
      if (!user) {
        throw new Error("Usuario no encontrado")
      }

      // Calculate total players based on sport
      let totalPlayers = 0
      if (sport === "Fútbol") {
        // Fútbol: 7 jugadores por equipo
        totalPlayers = isTeamSport && selectedTeamId ? 14 : 7 // 14 if team match (2 teams), 7 if individual
      } else if (sport === "Baloncesto") {
        // Baloncesto: 5 jugadores por equipo
        totalPlayers = isTeamSport && selectedTeamId ? 10 : 5 // 10 if team match (2 teams), 5 if individual
      } else {
        // Tenis and Pádel: use input value
        totalPlayers = parseInt(players) || 2
      }

      const matchData: any = {
        sport,
        createdBy: currentUser.id,
        createdByName: user.name,
        createdByUsername: user.username,
        date,
        time,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: location.address || `${sport} - ${date} ${time}`,
        },
        totalPlayers,
        requiresApproval,
        distance: parseInt(distance) || 0,
      }

      // Add team information if it's a team sport
      if (isTeamSport && selectedTeamId) {
        const selectedTeam = teams.find(t => t.id === selectedTeamId)
        if (selectedTeam) {
          matchData.isTeamMatch = true
          matchData.team1Id = selectedTeam.id
          matchData.team1Name = selectedTeam.name
          // For Fútbol and Baloncesto, always looking for another team
          matchData.lookingForTeam = true
        }
      }

      await createMatch(matchData)

      setToast({ message: "Partido creado exitosamente", type: "success" })
      setTimeout(() => {
        router.push("/home")
      }, 1500)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Error al crear el partido",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="flex-1 p-4 md:container md:mx-auto md:max-w-2xl md:py-8">
        <h1 className="mb-6 text-3xl font-bold">Crear Partido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sport">Deporte</Label>
            <select
              id="sport"
              value={sport}
              onChange={(e) => {
                setSport(e.target.value)
                setIsTeamMatch(false)
                setSelectedTeamId("")
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Selecciona un deporte</option>
              <option value="Fútbol">Fútbol</option>
              <option value="Baloncesto">Baloncesto</option>
              <option value="Tenis">Tenis</option>
              <option value="Pádel">Pádel</option>
            </select>
          </div>

          {isTeamSport && (
            <>
              {teams.length === 0 ? (
                <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      No tienes equipos de {sport}.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => router.push("/teams/create")}
                      >
                        Crea uno aquí
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="team">Selecciona tu Equipo</Label>
                    <select
                      id="team"
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Selecciona un equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.members.length}/{team.maxMembers} miembros)
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Tu equipo buscará enfrentarse a otro equipo
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Número de jugadores - Solo para Tenis y Pádel */}
          {!isTeamSport && (
            <div className="space-y-2">
              <Label htmlFor="players">Número de jugadores</Label>
              <Input
                id="players"
                type="number"
                min="2"
                max="4"
                placeholder="Ej: 2 (individual), 4 (dobles)"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {sport === "Tenis" || sport === "Pádel" 
                  ? "2 para individual, 4 para dobles"
                  : ""}
              </p>
            </div>
          )}

          {/* Información de jugadores fijos para Fútbol y Baloncesto */}
          {isTeamSport && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {sport === "Fútbol" ? (
                    <>
                      <p className="text-sm font-medium">
                        Número de jugadores: 7 por equipo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: 14 jugadores (2 equipos)
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Número de jugadores: 5 por equipo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: 10 jugadores (2 equipos)
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="approval">Requiere Aprobación</Label>
              <p className="text-sm text-muted-foreground">
                Los usuarios necesitarán tu aprobación para unirse
              </p>
            </div>
            <Switch
              id="approval"
              checked={requiresApproval}
              onCheckedChange={setRequiresApproval}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance">Distancia (metros)</Label>
            <Input
              id="distance"
              type="number"
              min="0"
              placeholder="Ej: 300"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Ej: Campo de Fútbol Central, Madrid"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
              <p className="text-sm text-muted-foreground">
                Haz clic en el mapa para seleccionar la ubicación del partido
              </p>
            </CardHeader>
            <CardContent>
              <LocationPicker
                location={location}
                onLocationChange={(newLocation) => {
                  setLocation(newLocation)
                }}
              />
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                {location.address && (
                  <p className="text-xs text-muted-foreground">
                    Dirección: {location.address}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear"}
          </Button>
        </form>
      </div>

      <MobileBottomNav />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

