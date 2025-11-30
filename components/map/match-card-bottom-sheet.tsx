"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Match } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MatchCardBottomSheetProps {
  match: Match | null
  creatorName?: string
  creatorUsername?: string
  creatorId?: string
  creatorAvatar?: string
  onClose: () => void
  onJoin: (matchId: string) => void
  onLeave?: (matchId: string) => void
  onViewTeam?: (teamId: string) => void
  currentUserId?: string
  isUserInTeam?: (match: Match, userId: string) => boolean
  participants?: Array<{ id: string; name: string; username: string; avatar?: string }>
  teams?: Array<{ id: string; name: string; members: Array<{ id: string; name: string; username: string; avatar?: string }>; maxMembers: number }>
}

export function MatchCardBottomSheet({
  match,
  creatorName,
  creatorUsername,
  creatorId,
  creatorAvatar,
  onClose,
  onJoin,
  onLeave,
  onViewTeam,
  currentUserId,
  isUserInTeam,
  participants = [],
  teams = [],
}: MatchCardBottomSheetProps) {
  useEffect(() => {
    if (match) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [match])

  if (!match) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          match ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-out",
          "bg-background rounded-t-2xl shadow-2xl border-t",
          "max-h-[85vh] overflow-y-auto",
          "md:max-w-lg md:left-1/2 md:-translate-x-1/2 md:rounded-t-xl",
          match ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-4 pb-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">
                    {match.sport}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {match.distance}m de distancia
                  </p>
                </div>
                <div className="text-right">
                  {match.isTeamMatch ? (() => {
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
                    return (
                      <>
                        <p className="text-2xl font-bold text-primary">
                          {current}/{total}
                        </p>
                        <p className="text-xs text-muted-foreground">jugadores</p>
                      </>
                    )
                  })() : (
                    <>
                      <p className="text-2xl font-bold text-primary">
                        {match.currentPlayers}/{match.totalPlayers}
                      </p>
                      <p className="text-xs text-muted-foreground">jugadores</p>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Creator Info */}
              {(creatorName || creatorUsername) && (
                <Link
                  href={creatorId ? `/profile/${creatorId}` : "#"}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={creatorAvatar} />
                    <AvatarFallback>
                      {creatorName?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{creatorName || "Usuario"}</p>
                    {creatorUsername && (
                      <p className="text-sm text-muted-foreground">
                        @{creatorUsername}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              {/* Team Info */}
              {match.isTeamMatch && (
                <div className="space-y-3">
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
                                if (onViewTeam) {
                                  onViewTeam(match.team1Id!)
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
                                if (onViewTeam) {
                                  onViewTeam(match.team2Id!)
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

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <p className="font-semibold">
                    {new Date(match.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Hora</p>
                  <p className="font-semibold">{match.time}</p>
                </div>
              </div>

              {/* Teams List (for team matches) */}
              {match.isTeamMatch && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Equipos Participantes
                  </p>
                  <div className="space-y-3">
                    {match.team1Id && (() => {
                      const team1 = teams.find(t => t.id === match.team1Id)
                      if (!team1) return null
                      return (
                        <div
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            if (onViewTeam) {
                              onViewTeam(match.team1Id!)
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex -space-x-2">
                              {team1.members.slice(0, 4).map((member) => (
                                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {team1.members.length > 4 && (
                                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                  +{team1.members.length - 4}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{team1.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {team1.members.length}/{team1.maxMembers} miembros
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
                      return (
                        <div
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            if (onViewTeam) {
                              onViewTeam(match.team2Id!)
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex -space-x-2">
                              {team2.members.slice(0, 4).map((member) => (
                                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {team2.members.length > 4 && (
                                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                  +{team2.members.length - 4}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{team2.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {team2.members.length}/{team2.maxMembers} miembros
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

              {/* Participants List (for non-team matches) */}
              {!match.isTeamMatch && participants.length > 0 && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Participantes ({participants.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {participants.map((participant) => {
                      const isCurrentUser = currentUserId && participant.id === currentUserId
                      return (
                        <Link
                          key={participant.id}
                          href={`/profile/${participant.id}`}
                          className="flex items-center justify-between gap-2 rounded-lg border p-2 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>
                                {participant.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {participant.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-muted-foreground">(Tú)</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{participant.username}
                              </p>
                            </div>
                          </div>
                          {!isCurrentUser && (
                            <Button variant="ghost" size="sm" className="text-xs">
                              Ver perfil
                            </Button>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-2">Ubicación</p>
                <p className="font-medium">{match.location.address}</p>
                {match.requiresApproval && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    La ubicación completa será visible después de la aprobación
                  </p>
                )}
              </div>

              {/* Action Button */}
              {currentUserId && match.createdBy === currentUserId ? (
                <Button variant="outline" className="w-full" size="lg" disabled>
                  Tu partido
                </Button>
              ) : currentUserId && match.players.includes(currentUserId) ? (
                onLeave ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      onLeave(match.id)
                      onClose()
                    }}
                  >
                    Salirse del partido
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Ya estás unido
                  </Button>
                )
              ) : currentUserId && isUserInTeam && isUserInTeam(match, currentUserId) ? (
                <Button variant="outline" className="w-full" size="lg" disabled>
                  Tu equipo está en este partido
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onJoin(match.id)
                    onClose()
                  }}
                  className="w-full"
                  size="lg"
                >
                  {match.requiresApproval ? "Solicitar Unirse" : "Unirse"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

