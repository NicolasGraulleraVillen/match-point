"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { SearchMatchesModal } from "@/components/search-matches-modal"
import { MatchMap } from "@/components/map/match-map"
import { TeamDetailsModal } from "@/components/team-details-modal"
import { MatchCardBottomSheet } from "@/components/map/match-card-bottom-sheet"
import usersData from "@/data/users.json"
import { Match, User } from "@/types"
import { useAuth } from "@/hooks/use-auth"
import { updateMatch, deleteMatch, getTeams } from "@/lib/api-client"
import { Trash2, Search } from "lucide-react"
import { Team } from "@/types"

export default function AhoraPage() {
  const router = useRouter()
  const { isLoggedIn, loading, currentUser } = useAuth()
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [selectedMatchForMap, setSelectedMatchForMap] = useState<Match | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState<{ minDate: string; sport: string; level: string }>({
    minDate: "",
    sport: "all",
    level: "all"
  })
  const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null)
  const [teamModalOpen, setTeamModalOpen] = useState(false)

  // Load matches and teams from API
  useEffect(() => {
    if (isLoggedIn) {
      loadMatches()
      loadTeams()
    }
  }, [isLoggedIn])

  const loadMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error("Error loading matches:", error)
    } finally {
      setIsLoadingMatches(false)
    }
  }

  const loadTeams = async () => {
    try {
      const allTeams = await getTeams()
      setTeams(allTeams)
    } catch (error) {
      console.error("Error loading teams:", error)
    }
  }

  const getTeamName = (teamId: string | undefined) => {
    if (!teamId) return null
    return teams.find(t => t.id === teamId)?.name || null
  }

  if (loading || isLoadingMatches) {
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

  // Check if user is part of a team in the match
  const isUserInMatchTeam = (match: Match, userId: string): boolean => {
    if (!match.isTeamMatch) return false
    if (match.team1Id) {
      const team1 = teams.find(t => t.id === match.team1Id)
      if (team1 && team1.members.includes(userId)) return true
    }
    if (match.team2Id) {
      const team2 = teams.find(t => t.id === match.team2Id)
      if (team2 && team2.members.includes(userId)) return true
    }
    return false
  }

  // Calculate total players in team match
  const getTeamMatchPlayersCount = (match: Match): { current: number; total: number } => {
    if (!match.isTeamMatch) {
      return { current: match.currentPlayers, total: match.totalPlayers }
    }
    
    let current = 0
    let total = 0
    
    if (match.team1Id) {
      const team1 = teams.find(t => t.id === match.team1Id)
      if (team1) {
        current += team1.members.length
        total += team1.maxMembers
      }
    }
    
    if (match.team2Id) {
      const team2 = teams.find(t => t.id === match.team2Id)
      if (team2) {
        current += team2.members.length
        total += team2.maxMembers
      }
    }
    
    return { current, total }
  }

  const handleJoinRequest = async (matchId: string) => {
    if (!currentUser) return
    
    const match = matches.find((m) => m.id === matchId)
    if (!match) return

    // Check if user is already in the match
    if (match.players.includes(currentUser.id)) {
      toast.info("Ya estás en este partido")
      return
    }

    // Check if user is part of a team in the match
    if (isUserInMatchTeam(match, currentUser.id)) {
      toast.info("Ya estás en este partido como parte de un equipo")
      return
    }

    // If no approval required, join directly
    if (!match.requiresApproval) {
      try {
        // Ensure user is added to participants
        const updatedPlayers = [...match.players, currentUser.id]
        await updateMatch(match.id, {
          players: updatedPlayers,
          currentPlayers: updatedPlayers.length,
        })
        toast.success("Te has unido al partido exitosamente")
        await loadMatches()
      } catch (error) {
        toast.error("Error al unirse al partido")
      }
    } else {
      // If approval required, show dialog
      setSelectedMatch(matchId)
    }
  }

  const handleMatchSelectFromMap = (match: Match) => {
    setSelectedMatchForMap(match)
  }

  const handleConfirmJoin = async () => {
    if (selectedMatch && currentUser) {
      const match = matches.find((m) => m.id === selectedMatch)
      if (match) {
        // Check if already in pending requests or players
        if (match.pendingRequests.includes(currentUser.id) || match.players.includes(currentUser.id)) {
          toast.error("Ya estás en este partido o has solicitado unirte")
          setSelectedMatch(null)
          return
        }

        try {
          if (match.requiresApproval) {
            // Add to pending requests
            await updateMatch(match.id, {
              pendingRequests: [...match.pendingRequests, currentUser.id],
            })
            toast.success("Solicitud enviada. Esperando aprobación.")
          } else {
            // Add directly to players - ensure user is added to participants
            const updatedPlayers = [...match.players, currentUser.id]
            await updateMatch(match.id, {
              players: updatedPlayers,
              currentPlayers: updatedPlayers.length,
            })
            toast.success("Te has unido al partido exitosamente")
          }
          await loadMatches() // Reload matches
          setSelectedMatch(null)
        } catch (error) {
          toast.error("Error al unirse al partido")
        }
      }
    }
  }

  const handleLeaveMatch = async (matchId: string) => {
    if (!currentUser) return
    
    const match = matches.find((m) => m.id === matchId)
    if (!match) return

    // Can't leave if you're the creator
    if (match.createdBy === currentUser.id) {
      toast.error("No puedes salirte de tu propio partido. Elimínalo si ya no lo necesitas.")
      return
    }

    if (!confirm("¿Estás seguro de que quieres salirte de este partido?")) {
      return
    }

    try {
      // Remove from players
      const updatedPlayers = match.players.filter(id => id !== currentUser.id)
      // Remove from pending requests if there
      const updatedPendingRequests = match.pendingRequests.filter(id => id !== currentUser.id)
      
      await updateMatch(match.id, {
        players: updatedPlayers,
        pendingRequests: updatedPendingRequests,
        currentPlayers: updatedPlayers.length,
      })
      toast.success("Te has salido del partido")
      await loadMatches()
    } catch (error) {
      toast.error("Error al salirse del partido")
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este partido?")) {
      return
    }

    try {
      await deleteMatch(matchId)
      toast.success("Partido eliminado exitosamente")
      await loadMatches() // Reload matches
    } catch (error) {
      toast.error("Error al eliminar el partido")
    }
  }

  const match = selectedMatch
    ? matches.find((m) => m.id === selectedMatch)
    : null
  const creator = match
    ? (usersData as User[]).find((u) => u.id === match.createdBy)
    : null

  const mapMatchCreator = selectedMatchForMap
    ? (usersData as User[]).find((u) => u.id === selectedMatchForMap.createdBy)
    : null

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="space-y-6">
        {/* Map Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Ahora</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchModalOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-64">
                <MatchMap
                  matches={matches}
                  teams={teams.filter(t => t.location)}
                  onMatchSelect={handleMatchSelectFromMap}
                  center={[40.4168, -3.7038]}
                  zoom={13}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Matches */}
        {currentUser && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Mis Partidos</h2>
            <div className="space-y-4">
              {matches.filter(m => 
                m.players.includes(currentUser.id) || 
                m.pendingRequests.includes(currentUser.id) ||
                m.createdBy === currentUser.id
              ).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No tienes partidos</p>
                  </CardContent>
                </Card>
              ) : (
                matches
                  .filter(m => 
                    m.players.includes(currentUser.id) || 
                    m.pendingRequests.includes(currentUser.id) ||
                    m.createdBy === currentUser.id
                  )
                  .map((match) => (
                    <Card key={match.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {match.isTeamMatch ? (
                                match.lookingForTeam ? (
                                  <>
                                    {match.team1Name} buscando equipo
                                  </>
                                ) : match.team2Name ? (
                                  <>
                                    {match.team1Name} vs {match.team2Name}
                                  </>
                                ) : (
                                  <>
                                    {match.team1Name} vs ?
                                  </>
                                )
                              ) : (
                                <>
                                  {match.sport} a {match.distance}m
                                </>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(match.date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              a las {match.time}
                              {match.isTeamMatch && match.team1Name && (
                                <span className="ml-2">• {match.sport}</span>
                              )}
                            </p>
                          </div>
                          {currentUser && match.createdBy === currentUser.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMatch(match.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Creator Info */}
                        <div className="mb-4 rounded-lg border p-3">
                          <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Creado por
                          </p>
                          <Link
                            href={`/profile/${match.createdBy}`}
                            className="flex items-center gap-2 hover:opacity-80"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {match.createdByName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{match.createdByName}</p>
                              <p className="text-xs text-muted-foreground">
                                @{match.createdByUsername}
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Match Details */}
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            {match.isTeamMatch ? (
                              <>
                                <p className="text-sm font-medium">
                                  {match.lookingForTeam 
                                    ? `${match.team1Name} busca otro equipo`
                                    : match.team2Name
                                    ? `Equipo vs Equipo`
                                    : `Equipo buscando rival`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Deporte: {match.sport}
                                </p>
                                {(() => {
                                  const { current, total } = getTeamMatchPlayersCount(match)
                                  return (
                                    <p className="text-sm text-muted-foreground">
                                      Jugadores: {current}/{total}
                                    </p>
                                  )
                                })()}
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium">Deporte: {match.sport}</p>
                                <p className="text-sm text-muted-foreground">
                                  Plazas: {match.currentPlayers}/{match.totalPlayers}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Distancia: {match.distance}m
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Teams List (for team matches) */}
                        {match.isTeamMatch && (
                          <div className="mb-4 rounded-lg border p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Equipos Participantes
                            </p>
                            <div className="space-y-3">
                              {match.team1Id && (() => {
                                const team1 = teams.find(t => t.id === match.team1Id)
                                if (!team1) return null
                                const team1Members = (usersData as User[]).filter(u => team1.members.includes(u.id))
                                return (
                                  <div
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                                    onClick={() => {
                                      setSelectedTeamForModal(team1)
                                      setTeamModalOpen(true)
                                    }}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="flex -space-x-2">
                                        {team1Members.slice(0, 4).map((member) => (
                                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="text-xs">
                                              {member.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                        {team1Members.length > 4 && (
                                          <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                            +{team1Members.length - 4}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{team1.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {team1Members.length}/{team1.maxMembers} miembros
                                        </p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                      Ver equipo →
                                    </Button>
                                  </div>
                                )
                              })()}
                              {match.team2Id && (() => {
                                const team2 = teams.find(t => t.id === match.team2Id)
                                if (!team2) return null
                                const team2Members = (usersData as User[]).filter(u => team2.members.includes(u.id))
                                return (
                                  <div
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                                    onClick={() => {
                                      setSelectedTeamForModal(team2)
                                      setTeamModalOpen(true)
                                    }}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="flex -space-x-2">
                                        {team2Members.slice(0, 4).map((member) => (
                                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="text-xs">
                                              {member.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                        {team2Members.length > 4 && (
                                          <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                            +{team2Members.length - 4}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{team2.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {team2Members.length}/{team2.maxMembers} miembros
                                        </p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                      Ver equipo →
                                    </Button>
                                  </div>
                                )
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Players List (for non-team matches) */}
                        {!match.isTeamMatch && match.players.length > 0 && (
                          <div className="mb-4 rounded-lg border p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Participantes ({match.players.length})
                            </p>
                            <div className="space-y-2">
                              {match.players.map((playerId) => {
                                const player = (usersData as User[]).find(u => u.id === playerId)
                                if (!player) return null
                                const isCurrentUser = currentUser && playerId === currentUser.id
                                return (
                                  <div
                                    key={playerId}
                                    className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
                                  >
                                    <Link
                                      href={`/profile/${playerId}`}
                                      className="flex items-center gap-2 flex-1 hover:opacity-80"
                                    >
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={player.avatar} />
                                        <AvatarFallback>
                                          {player.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {player.name}
                                          {isCurrentUser && (
                                            <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>
                                          )}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          @{player.username}
                                        </p>
                                      </div>
                                    </Link>
                                    {!isCurrentUser && (
                                      <Link href={`/profile/${playerId}`}>
                                        <Button variant="ghost" size="sm" className="text-xs">
                                          Ver perfil
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {match.createdBy === currentUser.id ? (
                          <Button variant="outline" className="w-full" disabled>
                            Tu partido
                          </Button>
                        ) : match.players.includes(currentUser.id) ? (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleLeaveMatch(match.id)}
                          >
                            Salirse del partido
                          </Button>
                        ) : currentUser && isUserInMatchTeam(match, currentUser.id) ? (
                          <Button variant="outline" className="w-full" disabled>
                            Tu equipo está en este partido
                          </Button>
                        ) : match.pendingRequests.includes(currentUser.id) ? (
                          <Button variant="outline" className="w-full" disabled>
                            Solicitud pendiente
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleJoinRequest(match.id)}
                            className="w-full"
                            variant="default"
                          >
                            {match.requiresApproval ? "Solicitar" : "Unirse"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </section>
        )}

        {/* Available Matches */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Partidos Disponibles</h2>
          <div className="space-y-4">
            {matches.filter(m => {
              if (!currentUser) return false
              if (m.players.includes(currentUser.id)) return false
              if (m.pendingRequests.includes(currentUser.id)) return false
              if (m.createdBy === currentUser.id) return false
              if (isUserInMatchTeam(m, currentUser.id)) return false
              return true
            }).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No hay partidos disponibles</p>
                </CardContent>
              </Card>
            ) : (
              matches
                .filter(m => {
                  if (!currentUser) return false
                  if (m.players.includes(currentUser.id)) return false
                  if (m.pendingRequests.includes(currentUser.id)) return false
                  if (m.createdBy === currentUser.id) return false
                  if (isUserInMatchTeam(m, currentUser.id)) return false
                  return true
                })
                .map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {match.isTeamMatch ? (
                            match.lookingForTeam ? (
                              <>
                                {match.team1Name} buscando equipo
                              </>
                            ) : match.team2Name ? (
                              <>
                                {match.team1Name} vs {match.team2Name}
                              </>
                            ) : (
                              <>
                                {match.team1Name} vs ?
                              </>
                            )
                          ) : (
                            <>
                              {match.sport} a {match.distance}m
                            </>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(match.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          a las {match.time}
                          {match.isTeamMatch && match.team1Name && (
                            <span className="ml-2">• {match.sport}</span>
                          )}
                        </p>
                      </div>
                      {currentUser && match.createdBy === currentUser.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMatch(match.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Creator Info */}
                    <div className="mb-4 rounded-lg border p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Creado por
                      </p>
                      <Link
                        href={`/profile/${match.createdBy}`}
                        className="flex items-center gap-2 hover:opacity-80"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={usersData.find(u => u.id === match.createdBy)?.avatar} />
                          <AvatarFallback>
                            {match.createdByName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{match.createdByName}</p>
                          <p className="text-xs text-muted-foreground">
                            @{match.createdByUsername}
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Team Info */}
                    {match.isTeamMatch && (
                      <div className="mb-4 space-y-3">
                        {match.team1Name && (
                          <div className="rounded-lg border p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Equipo Local
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{match.team1Name}</p>
                                {match.team1Id && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => {
                                      const team = teams.find(t => t.id === match.team1Id)
                                      if (team) {
                                        setSelectedTeamForModal(team)
                                        setTeamModalOpen(true)
                                      }
                                    }}
                                  >
                                    Ver equipo
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {match.team2Name && (
                          <div className="rounded-lg border p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Equipo Visitante
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{match.team2Name}</p>
                                {match.team2Id && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => {
                                      const team = teams.find(t => t.id === match.team2Id)
                                      if (team) {
                                        setSelectedTeamForModal(team)
                                        setTeamModalOpen(true)
                                      }
                                    }}
                                  >
                                    Ver equipo
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {match.lookingForTeam && (
                          <div className="rounded-lg border border-dashed p-3">
                            <p className="text-sm text-muted-foreground">
                              {match.team1Name} está buscando otro equipo
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Match Details */}
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        {match.isTeamMatch ? (
                          <>
                            <p className="text-sm font-medium">
                              {match.lookingForTeam 
                                ? `${match.team1Name} busca otro equipo`
                                : match.team2Name
                                ? `Equipo vs Equipo`
                                : `Equipo buscando rival`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Deporte: {match.sport}
                            </p>
                            {(() => {
                              const { current, total } = getTeamMatchPlayersCount(match)
                              return (
                                <p className="text-sm text-muted-foreground">
                                  Jugadores: {current}/{total}
                                </p>
                              )
                            })()}
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Deporte: {match.sport}</p>
                            <p className="text-sm text-muted-foreground">
                              Plazas: {match.currentPlayers}/{match.totalPlayers}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Distancia: {match.distance}m
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Teams List (for team matches) */}
                    {match.isTeamMatch && (
                      <div className="mb-4 rounded-lg border p-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Equipos Participantes
                        </p>
                        <div className="space-y-3">
                          {match.team1Id && (() => {
                            const team1 = teams.find(t => t.id === match.team1Id)
                            if (!team1) return null
                            const team1Members = (usersData as User[]).filter(u => team1.members.includes(u.id))
                            return (
                              <div
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                  setSelectedTeamForModal(team1)
                                  setTeamModalOpen(true)
                                }}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex -space-x-2">
                                    {team1Members.slice(0, 4).map((member) => (
                                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="text-xs">
                                          {member.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {team1Members.length > 4 && (
                                      <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                        +{team1Members.length - 4}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{team1.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {team1Members.length}/{team1.maxMembers} miembros
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs">
                                  Ver equipo →
                                </Button>
                              </div>
                            )
                          })()}
                          {match.team2Id && (() => {
                            const team2 = teams.find(t => t.id === match.team2Id)
                            if (!team2) return null
                            const team2Members = (usersData as User[]).filter(u => team2.members.includes(u.id))
                            return (
                              <div
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                  setSelectedTeamForModal(team2)
                                  setTeamModalOpen(true)
                                }}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex -space-x-2">
                                    {team2Members.slice(0, 4).map((member) => (
                                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="text-xs">
                                          {member.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {team2Members.length > 4 && (
                                      <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                        +{team2Members.length - 4}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{team2.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {team2Members.length}/{team2.maxMembers} miembros
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs">
                                  Ver equipo →
                                </Button>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Players List (for non-team matches) */}
                    {!match.isTeamMatch && match.players.length > 0 && (
                      <div className="mb-4 rounded-lg border p-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Participantes ({match.players.length})
                        </p>
                        <div className="space-y-2">
                          {match.players.map((playerId) => {
                            const player = (usersData as User[]).find(u => u.id === playerId)
                            if (!player) return null
                            const isCurrentUser = currentUser && playerId === currentUser.id
                            return (
                              <div
                                key={playerId}
                                className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
                              >
                                <Link
                                  href={`/profile/${playerId}`}
                                  className="flex items-center gap-2 flex-1 hover:opacity-80"
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={player.avatar} />
                                    <AvatarFallback>
                                      {player.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {player.name}
                                      {isCurrentUser && (
                                        <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>
                                      )}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      @{player.username}
                                    </p>
                                  </div>
                                </Link>
                                {!isCurrentUser && (
                                  <Link href={`/profile/${playerId}`}>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                      Ver perfil
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    {match.isTeamMatch && match.lookingForTeam ? (
                      <Button
                        onClick={() => handleJoinRequest(match.id)}
                        className="w-full"
                        variant="default"
                      >
                        Mi equipo quiere jugar
                      </Button>
                    ) : currentUser && match.createdBy === currentUser.id ? (
                      <Button variant="outline" className="w-full" disabled>
                        Tu partido
                      </Button>
                    ) : currentUser && match.players.includes(currentUser.id) ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleLeaveMatch(match.id)}
                      >
                        Salirse del partido
                      </Button>
                    ) : currentUser && isUserInMatchTeam(match, currentUser.id) ? (
                      <Button variant="outline" className="w-full" disabled>
                        Tu equipo está en este partido
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJoinRequest(match.id)}
                        className="w-full"
                        variant="default"
                      >
                        {match.requiresApproval ? "Solicitar" : "Unirse"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Create Match Button */}
        <div className="pb-4">
          <Link href="/create">
            <Button className="w-full" size="lg">
              Crear Partida
            </Button>
          </Link>
        </div>
        </div>
      </main>

      <MobileBottomNav />

      {/* Search Modal */}
      <SearchMatchesModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onSearch={(filters) => {
          setSearchFilters(filters)
          // Apply filters to matches (you can implement filtering logic here)
          toast.success("Filtros aplicados")
        }}
      />

      {/* Match Card Bottom Sheet from Map */}
      <MatchCardBottomSheet
        match={selectedMatchForMap}
        creatorName={mapMatchCreator?.name}
        creatorUsername={mapMatchCreator?.username}
        creatorId={mapMatchCreator?.id}
        creatorAvatar={mapMatchCreator?.avatar}
        onClose={() => setSelectedMatchForMap(null)}
        onJoin={(matchId) => {
          handleJoinRequest(matchId)
          setSelectedMatchForMap(null)
        }}
        onLeave={(matchId) => {
          handleLeaveMatch(matchId)
          setSelectedMatchForMap(null)
        }}
        onViewTeam={(teamId) => {
          const team = teams.find(t => t.id === teamId)
          if (team) {
            setSelectedTeamForModal(team)
            setTeamModalOpen(true)
          }
        }}
        currentUserId={currentUser?.id}
        isUserInTeam={isUserInMatchTeam}
        participants={selectedMatchForMap && !selectedMatchForMap.isTeamMatch ? (selectedMatchForMap.players || []).map(playerId => {
          const player = (usersData as User[]).find(u => u.id === playerId)
          return player ? {
            id: player.id,
            name: player.name,
            username: player.username,
            avatar: player.avatar
          } : null
        }).filter(Boolean) as Array<{ id: string; name: string; username: string; avatar?: string }> : []}
        teams={selectedMatchForMap && selectedMatchForMap.isTeamMatch ? (() => {
          const teamArray: Array<{ id: string; name: string; members: Array<{ id: string; name: string; username: string; avatar?: string }>; maxMembers: number }> = []
          
          if (selectedMatchForMap.team1Id) {
            const team1 = teams.find(t => t.id === selectedMatchForMap.team1Id)
            if (team1) {
              teamArray.push({
                id: team1.id,
                name: team1.name,
                members: (usersData as User[]).filter(u => team1.members.includes(u.id)).map(u => ({
                  id: u.id,
                  name: u.name,
                  username: u.username,
                  avatar: u.avatar
                })),
                maxMembers: team1.maxMembers
              })
            }
          }
          
          if (selectedMatchForMap.team2Id) {
            const team2 = teams.find(t => t.id === selectedMatchForMap.team2Id)
            if (team2) {
              teamArray.push({
                id: team2.id,
                name: team2.name,
                members: (usersData as User[]).filter(u => team2.members.includes(u.id)).map(u => ({
                  id: u.id,
                  name: u.name,
                  username: u.username,
                  avatar: u.avatar
                })),
                maxMembers: team2.maxMembers
              })
            }
          }
          
          return teamArray
        })() : []}
      />

      {/* Team Details Modal */}
      {selectedTeamForModal && (
        <TeamDetailsModal
          team={selectedTeamForModal}
          open={teamModalOpen}
          onOpenChange={setTeamModalOpen}
          currentUser={currentUser || null}
          teamMembers={(usersData as User[]).filter(u => selectedTeamForModal.members.includes(u.id))}
          onUpdate={() => {
            loadTeams()
            loadMatches()
          }}
        />
      )}

      {/* Join Request Dialog */}
      <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Unirse</DialogTitle>
            <DialogDescription>
              {match && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-medium">Deporte:</p>
                    <p className="text-muted-foreground">{match.sport}</p>
                  </div>
                  <div>
                    <p className="font-medium">Creada por:</p>
                    {creator && (
                      <Link
                        href={`/profile/${creator.id}`}
                        className="mt-2 flex items-center gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Avatar>
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>
                            {creator.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{creator.name}</p>
                          <p className="text-sm text-muted-foreground">
                            @{creator.username}
                          </p>
                          <p className="text-xs text-primary mt-1">Ver perfil →</p>
                        </div>
                      </Link>
                    )}
                  </div>
                  {match.isTeamMatch && (
                    <div>
                      <p className="font-medium">Equipos:</p>
                      <div className="mt-2 space-y-2">
                        {match.team1Name && (
                          <div className="rounded-lg border p-3">
                            <p className="text-sm font-semibold">{match.team1Name}</p>
                            {match.team1Id && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  const team = teams.find(t => t.id === match.team1Id)
                                  if (team) {
                                    setSelectedTeamForModal(team)
                                    setTeamModalOpen(true)
                                  }
                                }}
                              >
                                Ver equipo →
                              </Button>
                            )}
                          </div>
                        )}
                        {match.team2Name && (
                          <div className="rounded-lg border p-3">
                            <p className="text-sm font-semibold">{match.team2Name}</p>
                            {match.team2Id && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  const team = teams.find(t => t.id === match.team2Id)
                                  if (team) {
                                    setSelectedTeamForModal(team)
                                    setTeamModalOpen(true)
                                  }
                                }}
                              >
                                Ver equipo →
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Fecha:</p>
                    <p className="text-muted-foreground">
                      {new Date(match.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <div className="mt-2 h-32 rounded-lg bg-muted"></div>
                    {match.requiresApproval && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        La ubicación será visible después de que {creator?.name} apruebe tu unión a la partida.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={handleConfirmJoin} className="w-full">
              Solicitar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

