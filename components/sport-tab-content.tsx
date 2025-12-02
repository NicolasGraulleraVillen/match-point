"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { SportIcon, getSportName } from "@/lib/sport-utils";
//import { Level } from "@/types";
import { TeamDetailsModal } from "@/components/team-details-modal";
import { getTeams, deleteTeam, updateTeam } from "@/lib/api-client";
import { Team, User } from "@/types";
import usersData from "@/data/users.json";
import { LogOut, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SportTabContentProps {
  sport: string;
  user: User;
  onUpdate: () => void;
}

export function SportTabContent({ sport, user, onUpdate }: SportTabContentProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, [sport, user.id]);

  const loadTeams = async () => {
    try {
      const allTeams = await getTeams();
      const userTeams = allTeams.filter((t) => t.members.includes(user.id) && t.sport === sport);
      setTeams(userTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async (teamToLeave: Team) => {
    try {
      const updatedMembers = teamToLeave.members.filter((m) => m !== user.id);

      if (updatedMembers.length === 0) {
        // 1. Caso: Último miembro abandona -> Borrar equipo
        await deleteTeam(teamToLeave.id);
        console.log(`Equipo ${teamToLeave.name} borrado.`);
      } else {
        // 2. Caso: Hay más miembros -> Actualizar equipo
        // **USAMOS LA FUNCIÓN updateTeam PROPORCIONADA**
        await updateTeam(teamToLeave.id, {
          members: updatedMembers,
        });
        console.log(`Miembro ${user.id} salió del equipo ${teamToLeave.name}.`);
      }

      // Recargar la lista de equipos y cerrar el diálogo
      await loadTeams();
      setShowLeaveDialog(false);
      onUpdate();
    } catch (error) {
      console.error("Error al salir del equipo:", error);
      // Mostrar una alerta básica al usuario sobre el fallo
      alert(`No se pudo salir del equipo: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const handleViewTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamModalOpen(true);
  };

  const rawStats = user.sportProfiles?.[sport]?.stats ?? {};

  const stats = {
    wins: rawStats.wins ?? 0,
    losses: rawStats.losses ?? 0,
    matches: rawStats.matches ?? 0,
    winRate: rawStats.winRate ?? 0,
    skillRating: rawStats.skillRating ?? 50,
    stamina: rawStats.stamina ?? 50,
    technique: rawStats.technique ?? 50,
    teamwork: rawStats.teamwork ?? 50,
  };

  const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;
  const finalWinRate = stats.winRate || winRate;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ label, value, max = 100 }: { label: string; value: number; max?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <Progress value={(value / max) * 100} className="h-2" />
    </div>
  );

  const userLevel = user.levels?.[sport] || "novato";

  return (
    <div className="space-y-6 w-full">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Partidos</span>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.matches || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.wins || 0}V · {stats.losses || 0}D
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Victoria</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold mb-2">{finalWinRate}%</div>
            <Progress value={finalWinRate} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Nivel</span>
              <SportIcon sport={sport} className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold capitalize mb-1">{userLevel}</div>
            <p className="text-xs text-muted-foreground">{stats.skillRating || 50}/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Card - FIFA Style */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Estadísticas - {getSportName(sport)}</CardTitle>
          <CardDescription className="text-sm">Tus habilidades según la gente contra la que has jugado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <StatCard label="Habilidad General" value={stats.skillRating || 50} />
              <StatCard label="Resistencia" value={stats.stamina || 50} />
            </div>
            <div className="space-y-3">
              <StatCard label="Técnica" value={stats.technique || 50} />
              <StatCard label="Trabajo en Equipo" value={stats.teamwork || 50} />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Nivel Actual
              </span>
              <Badge variant="outline" className="font-semibold capitalize">
                <SportIcon sport={sport} className="h-3 w-3 mr-1" />
                {userLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Section + Modales solo para deportes con equipos */}
      {(sport === "Fútbol" || sport === "Baloncesto") && (
        <>
          {/* Teams Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mis Equipos de {sport}
                </CardTitle>
                <Link href={`/teams/create?sport=${sport}`}>
                  <Button size="sm">Crear Equipo</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="py-6 text-center space-y-4">
                  <p className="text-muted-foreground">No estás en ningún equipo de {sport}</p>
                  <div className="flex gap-2 justify-center">
                    <Link href={`/teams/create?sport=${sport}`}>
                      <Button>Crear Equipo</Button>
                    </Link>
                    <Link href="/teams/join">
                      <Button variant="outline">Unirse a Equipo</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map((team) => {
                    const teamMembers = (usersData as User[]).filter((u) => team.members.includes(u.id));
                    console.log(teamMembers);
                    return (
                      <div key={team.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{team.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Código: <span className="font-mono font-bold">{team.code}</span> • {team.members.length}/
                            {team.maxMembers} miembros
                          </p>
                          {team.description && <p className="text-sm text-muted-foreground mt-1">{team.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewTeam(team)}>
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeam(team);
                              setShowLeaveDialog(true);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Salir
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Details Modal */}
          {selectedTeam && (
            <TeamDetailsModal
              team={selectedTeam}
              open={teamModalOpen}
              onOpenChange={setTeamModalOpen}
              currentUser={user}
              teamMembers={(usersData as User[]).filter((u) => selectedTeam.members.includes(u.id))}
              onUpdate={() => {
                loadTeams();
                onUpdate();
              }}
            />
          )}

          {/* Leave Team Dialog */}
          <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salir del Equipo</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres salir de &quot;{selectedTeam?.name}&quot;? Esta acción no se puede
                  deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowLeaveDialog(false);
                    setSelectedTeam(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => selectedTeam && handleLeaveTeam(selectedTeam)}
                >
                  Salir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
