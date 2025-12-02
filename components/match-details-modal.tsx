"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Match, User } from "@/types";
import { MapPin, Users, Clock } from "lucide-react";
import { SportIcon, getSportName } from "@/lib/sport-utils";
import { MatchMap } from "@/components/map/match-map";
import Link from "next/link";

interface MatchDetailsModalProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator?: User | null;
  participants?: User[];
  teams?: Array<{
    id: string;
    name: string;
    members: Array<{ id: string; name: string; username: string; avatar?: string }>;
    maxMembers: number;
  }>;
  onViewTeam?: (teamId: string) => void;
}

export function MatchDetailsModal({
  match,
  open,
  onOpenChange,
  creator,
  participants = [],
  teams = [],
  onViewTeam,
}: MatchDetailsModalProps) {
  if (!match) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "novato":
        return "bg-secondary text-secondary-foreground";
      case "intermedio":
        return "bg-highlight text-highlight-foreground";
      case "pro":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Calculate total players in team match
  const getTeamMatchPlayersCount = (): { current: number; total: number } => {
    if (!match.isTeamMatch) {
      return { current: match.currentPlayers, total: match.totalPlayers };
    }

    let current = 0;
    let total = 0;

    if (match.team1Id) {
      const team1 = teams.find((t) => t.id === match.team1Id);
      if (team1) {
        current += team1.members.length;
        total += team1.maxMembers;
      }
    }

    if (match.team2Id) {
      const team2 = teams.find((t) => t.id === match.team2Id);
      if (team2) {
        current += team2.members.length;
        total += team2.maxMembers;
      }
    }

    return { current, total };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <SportIcon sport={match.sport} className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-2xl">{getSportName(match.sport)}</DialogTitle>
              <DialogDescription>
                {new Date(match.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Match Details */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nivel Requerido</span>
              <Badge className={getLevelColor(match.requiresApproval ? "intermedio" : "novato")}>
                {match.requiresApproval ? "Intermedio" : "Novato"}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{match.time}</span>
            </div>

            {match.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{match.location.address}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {match.isTeamMatch
                  ? (() => {
                      const { current, total } = getTeamMatchPlayersCount();
                      return `${current}/${total} jugadores`;
                    })()
                  : `${match.currentPlayers}/${match.totalPlayers} jugadores`}
              </span>
            </div>
          </div>

          {/* Creator Info */}
          {creator && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  </div>
                </div>
                <Link href={`/profile/${creator.id}`}>
                  <Button variant="outline" size="sm">
                    Ver perfil
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Teams List (for team matches) */}
          {match.isTeamMatch && teams.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Equipos Participantes
              </h3>
              <div className="space-y-3">
                {match.team1Id &&
                  (() => {
                    const team1 = teams.find((t) => t.id === match.team1Id);
                    if (!team1) return null;
                    return (
                      <div
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          if (onViewTeam) {
                            onViewTeam(match.team1Id!);
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
                    );
                  })()}
                {match.team2Id &&
                  (() => {
                    const team2 = teams.find((t) => t.id === match.team2Id);
                    if (!team2) return null;
                    return (
                      <div
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          if (onViewTeam) {
                            onViewTeam(match.team2Id!);
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
                    );
                  })()}
              </div>
            </div>
          )}

          {/* Participants (for non-team matches) */}
          {!match.isTeamMatch && participants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes ({participants.length})
              </h3>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <Link
                    key={participant.id}
                    href={`/profile/${participant.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg border p-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{participant.username}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Ver perfil
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {match.location && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación
              </h3>
              <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                <MatchMap
                  matches={[match]}
                  teams={[]}
                  onMatchSelect={() => {}}
                  center={[match.location.lat, match.location.lng]}
                  zoom={15}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{match.location.address}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
