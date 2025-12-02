"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users as UsersIcon, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MatchMap } from "@/components/map/match-map";
import { MatchCardBottomSheet } from "@/components/map/match-card-bottom-sheet";
import { MiniMap } from "@/components/map/mini-map";
import { SearchMatchesModal, MatchFilters } from "@/components/search-matches-modal";
import { TeamDetailsModal } from "@/components/team-details-modal";
import { MatchDetailsModal } from "@/components/match-details-modal";
import usersData from "@/data/users.json";
import { User, Match, Team } from "@/types";
import { getTeams, updateMatch, deleteMatch } from "@/lib/api-client";
import { SportIcon, getSportName } from "@/lib/sport-utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, loading, currentUser } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<Match | null>(null);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<MatchFilters | null>(null);
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState<string | null>(null);

  // Get main sport from user or default to first sport
  const mainSport = currentUser?.mainSport || currentUser?.sports?.[0] || "Fútbol";
  const [selectedSport, setSelectedSport] = useState(mainSport);

  // Map sport names to match the types
  const sportMap: Record<string, string> = {
    Fútbol: "football",
    Baloncesto: "basketball",
    Tenis: "tennis",
    Pádel: "padel",
  };

  //const reverseSportMap: Record<string, string> = {
  //football: "Fútbol",
  //basketball: "Baloncesto",
  //tennis: "Tenis",
  //padel: "Pádel",
  //};

  useEffect(() => {
    if (isLoggedIn) {
      loadMatches();
      loadTeams();
    }
  }, [isLoggedIn]);

  const loadMatches = async () => {
    try {
      const response = await fetch("/api/matches");
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const loadTeams = async () => {
    try {
      const allTeams = await getTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  if (loading || isLoadingMatches) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  // Get user level for selected sport
  const getUserLevel = (): string => {
    if (!currentUser) return "novato";
    const sportKey = sportMap[selectedSport] || "football";
    return currentUser.levels?.[sportKey] || "novato";
  };

  // Get user points for selected sport
  const getUserPoints = (): number => {
    if (!currentUser) return 0;
    return currentUser.sportProfiles?.[selectedSport]?.stats?.wins
      ? (currentUser.sportProfiles[selectedSport].stats.wins || 0) * 10 +
          (currentUser.sportProfiles[selectedSport].stats.matches || 0) * 2
      : currentUser.points || 0;
  };

  // Filter matches by selected sport and search filters
  let filteredMatches = matches.filter((m) => m.sport === selectedSport && m.status !== "completed");

  // Apply search filters
  if (searchFilters) {
    if (searchFilters.minDate) {
      filteredMatches = filteredMatches.filter((m) => m.date >= searchFilters!.minDate);
    }
    if (searchFilters.maxDate) {
      filteredMatches = filteredMatches.filter((m) => m.date <= searchFilters!.maxDate);
    }
    if (searchFilters.time) {
      filteredMatches = filteredMatches.filter((m) => {
        const matchTime = m.time.split(":")[0];
        const filterTime = searchFilters!.time.split(":")[0];
        return Math.abs(parseInt(matchTime) - parseInt(filterTime)) <= 1;
      });
    }
    if (searchFilters.sport !== "all") {
      filteredMatches = filteredMatches.filter((m) => m.sport === searchFilters!.sport);
    }
    // Note: level filtering would require adding level to Match type
    if (searchFilters.maxDistance > 0) {
      // Distance filtering would require user location - simplified for now
      filteredMatches = filteredMatches.filter((m) => m.distance <= searchFilters!.maxDistance);
    }
  }

  /*
  const myMatches = filteredMatches.filter(
    (m) =>
      currentUser &&
      (m.players.includes(currentUser.id) ||
        m.pendingRequests.includes(currentUser.id) ||
        m.createdBy === currentUser.id)
  );*/

  // Get user's teams for the selected sport - same logic as in /profile
  const userTeams = currentUser
    ? teams.filter((t) => t.members.includes(currentUser.id) && t.sport === selectedSport)
    : [];

  /*
  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
  };*/

  const handleMatchSelectFromMap = (match: Match) => {
    setSelectedMatch(match);
  };

  // Check if user is part of a team in the match
  const isUserInMatchTeam = (match: Match, userId: string): boolean => {
    if (!match.isTeamMatch) return false;
    if (match.team1Id) {
      const team1 = teams.find((t) => t.id === match.team1Id);
      if (team1 && team1.members.includes(userId)) return true;
    }
    if (match.team2Id) {
      const team2 = teams.find((t) => t.id === match.team2Id);
      if (team2 && team2.members.includes(userId)) return true;
    }
    return false;
  };

  // Calculate total players in team match
  /*const getTeamMatchPlayersCount = (match: Match): { current: number; total: number } => {
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
  };*/

  const handleJoinRequest = async (matchId: string) => {
    if (!currentUser) return;

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    // Check if user is already in the match
    if (match.players.includes(currentUser.id)) {
      toast.info("Ya estás en este partido");
      return;
    }

    // Check if user is part of a team in the match
    if (isUserInMatchTeam(match, currentUser.id)) {
      toast.info("Ya estás en este partido como parte de un equipo");
      return;
    }

    // If no approval required, join directly
    if (!match.requiresApproval) {
      try {
        // Ensure user is added to participants
        const updatedPlayers = [...match.players, currentUser.id];
        await updateMatch(match.id, {
          players: updatedPlayers,
          currentPlayers: updatedPlayers.length,
        });
        toast.success("Te has unido al partido exitosamente");
        await loadMatches();
      } catch (error) {
        toast.error("Error al unirse al partido");
      }
    } else {
      // If approval required, show dialog
      setSelectedMatchForJoin(matchId);
    }
  };

  const handleConfirmJoin = async () => {
    if (selectedMatchForJoin && currentUser) {
      const match = matches.find((m) => m.id === selectedMatchForJoin);
      if (match) {
        // Check if already in pending requests or players
        if (match.pendingRequests.includes(currentUser.id) || match.players.includes(currentUser.id)) {
          toast.error("Ya estás en este partido o has solicitado unirte");
          setSelectedMatchForJoin(null);
          return;
        }

        try {
          if (match.requiresApproval) {
            // Add to pending requests
            await updateMatch(match.id, {
              pendingRequests: [...match.pendingRequests, currentUser.id],
            });
            toast.success("Solicitud enviada. Esperando aprobación.");
          } else {
            // Add directly to players - ensure user is added to participants
            const updatedPlayers = [...match.players, currentUser.id];
            await updateMatch(match.id, {
              players: updatedPlayers,
              currentPlayers: updatedPlayers.length,
            });
            toast.success("Te has unido al partido exitosamente");
          }
          await loadMatches(); // Reload matches
          setSelectedMatchForJoin(null);
        } catch (error) {
          toast.error("Error al unirse al partido");
        }
      }
    }
  };

  const handleLeaveMatch = async (matchId: string) => {
    if (!currentUser) return;

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    // Can't leave if you're the creator
    if (match.createdBy === currentUser.id) {
      toast.error("No puedes salirte de tu propio partido. Elimínalo si ya no lo necesitas.");
      return;
    }

    // Check if user is in a team for this match
    const isInTeam = isUserInMatchTeam(match, currentUser.id);
    if (isInTeam) {
      toast.error(
        "No puedes abandonar un partido de equipo individualmente. Contacta al creador del equipo si quieres salirte."
      );
      return;
    }

    if (!confirm("¿Estás seguro de que quieres salirte de este partido?")) {
      return;
    }

    try {
      // Remove from players
      const updatedPlayers = match.players.filter((id) => id !== currentUser.id);
      // Remove from pending requests if there
      const updatedPendingRequests = match.pendingRequests.filter((id) => id !== currentUser.id);

      await updateMatch(match.id, {
        players: updatedPlayers,
        pendingRequests: updatedPendingRequests,
        currentPlayers: updatedPlayers.length,
      });
      toast.success("Te has salido del partido");
      // Refresh matches and teams to ensure data is up to date
      await loadMatches();
      await loadTeams();
      // Close modal if it's open for this match
      if (selectedMatchForModal?.id === matchId) {
        setMatchModalOpen(false);
        setSelectedMatchForModal(null);
      }
    } catch (error) {
      toast.error("Error al salirse del partido");
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este partido? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await deleteMatch(matchId);
      toast.success("Partido eliminado exitosamente");
      // Refresh matches and teams to ensure data is up to date
      await loadMatches();
      await loadTeams();
      // Close modal if it's open for this match
      if (selectedMatchForModal?.id === matchId) {
        setMatchModalOpen(false);
        setSelectedMatchForModal(null);
      }
    } catch (error) {
      toast.error("Error al eliminar el partido");
    }
  };

  const selectedMatchCreator = selectedMatch
    ? (usersData as User[]).find((u) => u.id === selectedMatch.createdBy)
    : null;

  const matchForJoin = selectedMatchForJoin ? matches.find((m) => m.id === selectedMatchForJoin) : null;
  const creator = matchForJoin ? (usersData as User[]).find((u) => u.id === matchForJoin.createdBy) : null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Sport Selector - Clean Strava Style */}
        <div className="mb-6">
          <Tabs value={selectedSport} onValueChange={setSelectedSport} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto h-auto bg-muted/50">
              {(["Fútbol", "Baloncesto", "Tenis", "Pádel"] as string[]).map((sport) => (
                <TabsTrigger
                  key={sport}
                  value={sport}
                  className="flex flex-col items-center gap-1.5 py-3 data-[state=active]:bg-background"
                >
                  <SportIcon sport={sport} className="h-5 w-5" />
                  <span className="text-[11px] font-medium">{getSportName(sport)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* User Card - Clean Strava Profile Style */}
        {currentUser && (
          <Card className="mb-6 border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold leading-tight mb-1 truncate">{currentUser.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.university} · {getSportName(selectedSport)}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-muted/50 rounded-md">
                    <span className="text-xs font-medium text-muted-foreground">Nivel</span>
                    <span className="text-xs font-semibold capitalize">{getUserLevel()}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-primary leading-none">{getUserPoints()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Puntos</div>
                </div>
              </div>
            </CardContent>

            {/* Teams Section - Only for Fútbol and Baloncesto */}
            {(selectedSport === "Fútbol" || selectedSport === "Baloncesto") && (
              <CardContent className="pt-0 pb-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      Mis Equipos de {getSportName(selectedSport)}
                    </h3>
                  </div>
                  {userTeams.length > 0 ? (
                    <div className="space-y-2">
                      {userTeams.map((team) => {
                        const isCreator = currentUser && team.createdBy === currentUser.id;
                        const role = isCreator ? "Creador" : "Miembro";
                        return (
                          <div key={team.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{team.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {role} · Código: <span className="font-mono font-bold">{team.code}</span> ·{" "}
                                {team.members.length}/{team.maxMembers} miembros
                              </p>
                              {team.description && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">{team.description}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs flex-shrink-0 ml-2"
                              onClick={() => {
                                setSelectedTeamForModal(team);
                                setTeamModalOpen(true);
                              }}
                            >
                              Ver
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No estás en ningún equipo de {getSportName(selectedSport)}
                      </p>
                    </div>
                  )}
                  {/* Action buttons always visible for Fútbol and Baloncesto */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => router.push(`/teams/create?sport=${selectedSport}`)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Crear Equipo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => router.push("/teams/join")}
                    >
                      <UsersIcon className="mr-1 h-3.5 w-3.5" />
                      Unirse a Equipo
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Action Buttons - Strava Style */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button size="lg" onClick={() => router.push("/create")} className="h-12 text-sm font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Crear Partido
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setSearchModalOpen(true)}
            className="h-12 text-sm font-semibold"
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        {/* My Matches */}
        {currentUser && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Mis Partidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.filter(
                (m) =>
                  (m.players.includes(currentUser.id) ||
                    m.pendingRequests.includes(currentUser.id) ||
                    m.createdBy === currentUser.id ||
                    isUserInMatchTeam(m, currentUser.id)) &&
                  m.sport === selectedSport &&
                  m.status !== "completed" // ⬅️ añade esto
              ).length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No tienes partidos de {getSportName(selectedSport)}</p>
                  </CardContent>
                </Card>
              ) : (
                matches
                  .filter(
                    (m) =>
                      (m.players.includes(currentUser.id) ||
                        m.pendingRequests.includes(currentUser.id) ||
                        m.createdBy === currentUser.id ||
                        isUserInMatchTeam(m, currentUser.id)) &&
                      m.sport === selectedSport &&
                      m.status !== "completed" // ⬅️ y aquí también
                  )
                  .map((match) => (
                    <Card key={match.id} className="flex flex-col">
                      <CardContent className="p-4 flex flex-col gap-3">
                        {/* Deporte y Fecha */}
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{getSportName(match.sport)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(match.date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>

                        {/* Mapa Centrado */}
                        {match.location && (
                          <div className="flex justify-center">
                            <MiniMap match={match} className="w-full" />
                          </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedMatchForModal(match);
                              setMatchModalOpen(true);
                            }}
                          >
                            Ver Detalles
                          </Button>

                          {/* Botón Eliminar o Abandonar */}
                          {match.createdBy === currentUser.id ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => handleDeleteMatch(match.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Partido
                            </Button>
                          ) : (
                            (match.players.includes(currentUser.id) ||
                              match.pendingRequests.includes(currentUser.id) ||
                              isUserInMatchTeam(match, currentUser.id)) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleLeaveMatch(match.id)}
                              >
                                Abandonar Partido
                              </Button>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </section>
        )}

        {/* Partidos Disponibles - Map */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Partidos Disponibles</h2>
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
                <MatchMap
                  matches={filteredMatches}
                  teams={teams.filter((t) => t.sport === selectedSport && t.location)}
                  onMatchSelect={handleMatchSelectFromMap}
                  center={[40.4168, -3.7038]}
                  zoom={13}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <MobileBottomNav />

      {/* Search Modal */}
      <SearchMatchesModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onSearch={(filters) => {
          setSearchFilters(filters);
          setSearchModalOpen(false);
        }}
      />

      {/* Match Details Modal */}
      {selectedMatchForModal && (
        <MatchDetailsModal
          match={selectedMatchForModal}
          open={matchModalOpen}
          onOpenChange={setMatchModalOpen}
          creator={(usersData as User[]).find((u) => u.id === selectedMatchForModal.createdBy)}
          participants={
            !selectedMatchForModal.isTeamMatch
              ? (usersData as User[]).filter((u) => selectedMatchForModal.players.includes(u.id))
              : []
          }
          teams={
            selectedMatchForModal.isTeamMatch
              ? (() => {
                  const teamArray: Array<{
                    id: string;
                    name: string;
                    members: Array<{ id: string; name: string; username: string; avatar?: string }>;
                    maxMembers: number;
                  }> = [];

                  if (selectedMatchForModal.team1Id) {
                    const team1 = teams.find((t) => t.id === selectedMatchForModal.team1Id);
                    if (team1) {
                      teamArray.push({
                        id: team1.id,
                        name: team1.name,
                        members: (usersData as User[])
                          .filter((u) => team1.members.includes(u.id))
                          .map((u) => ({
                            id: u.id,
                            name: u.name,
                            username: u.username,
                            avatar: u.avatar,
                          })),
                        maxMembers: team1.maxMembers,
                      });
                    }
                  }

                  if (selectedMatchForModal.team2Id) {
                    const team2 = teams.find((t) => t.id === selectedMatchForModal.team2Id);
                    if (team2) {
                      teamArray.push({
                        id: team2.id,
                        name: team2.name,
                        members: (usersData as User[])
                          .filter((u) => team2.members.includes(u.id))
                          .map((u) => ({
                            id: u.id,
                            name: u.name,
                            username: u.username,
                            avatar: u.avatar,
                          })),
                        maxMembers: team2.maxMembers,
                      });
                    }
                  }

                  return teamArray;
                })()
              : []
          }
          onViewTeam={(teamId) => {
            const team = teams.find((t) => t.id === teamId);
            if (team) {
              setSelectedTeamForModal(team);
              setTeamModalOpen(true);
            }
          }}
        />
      )}

      {/* Team Details Modal */}
      {selectedTeamForModal && (
        <TeamDetailsModal
          team={selectedTeamForModal}
          open={teamModalOpen}
          onOpenChange={setTeamModalOpen}
          currentUser={currentUser || null}
          teamMembers={(usersData as User[]).filter((u) => selectedTeamForModal.members.includes(u.id))}
          onUpdate={() => {
            loadTeams();
          }}
        />
      )}

      {/* Match Card Bottom Sheet */}
      <MatchCardBottomSheet
        match={selectedMatch}
        creatorName={selectedMatchCreator?.name}
        creatorUsername={selectedMatchCreator?.username}
        creatorId={selectedMatchCreator?.id}
        creatorAvatar={selectedMatchCreator?.avatar}
        onClose={() => setSelectedMatch(null)}
        onJoin={(matchId) => {
          handleJoinRequest(matchId);
          setSelectedMatch(null);
        }}
        onViewTeam={(teamId) => {
          const team = teams.find((t) => t.id === teamId);
          if (team) {
            setSelectedTeamForModal(team);
            setTeamModalOpen(true);
          }
        }}
        currentUserId={currentUser?.id}
        isUserInTeam={isUserInMatchTeam}
        participants={
          selectedMatch && !selectedMatch.isTeamMatch
            ? ((selectedMatch.players || [])
                .map((playerId) => {
                  const player = (usersData as User[]).find((u) => u.id === playerId);
                  return player
                    ? {
                        id: player.id,
                        name: player.name,
                        username: player.username,
                        avatar: player.avatar,
                      }
                    : null;
                })
                .filter(Boolean) as Array<{ id: string; name: string; username: string; avatar?: string }>)
            : []
        }
        teams={
          selectedMatch && selectedMatch.isTeamMatch
            ? (() => {
                const teamArray: Array<{
                  id: string;
                  name: string;
                  members: Array<{ id: string; name: string; username: string; avatar?: string }>;
                  maxMembers: number;
                }> = [];

                if (selectedMatch.team1Id) {
                  const team1 = teams.find((t) => t.id === selectedMatch.team1Id);
                  if (team1) {
                    teamArray.push({
                      id: team1.id,
                      name: team1.name,
                      members: (usersData as User[])
                        .filter((u) => team1.members.includes(u.id))
                        .map((u) => ({
                          id: u.id,
                          name: u.name,
                          username: u.username,
                          avatar: u.avatar,
                        })),
                      maxMembers: team1.maxMembers,
                    });
                  }
                }

                if (selectedMatch.team2Id) {
                  const team2 = teams.find((t) => t.id === selectedMatch.team2Id);
                  if (team2) {
                    teamArray.push({
                      id: team2.id,
                      name: team2.name,
                      members: (usersData as User[])
                        .filter((u) => team2.members.includes(u.id))
                        .map((u) => ({
                          id: u.id,
                          name: u.name,
                          username: u.username,
                          avatar: u.avatar,
                        })),
                      maxMembers: team2.maxMembers,
                    });
                  }
                }

                return teamArray;
              })()
            : []
        }
      />

      {/* Join Request Dialog */}
      <Dialog open={!!selectedMatchForJoin} onOpenChange={() => setSelectedMatchForJoin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Unirse</DialogTitle>
            <DialogDescription>
              {matchForJoin && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-medium">Deporte:</p>
                    <p className="text-muted-foreground">{matchForJoin.sport}</p>
                  </div>
                  <div>
                    <p className="font-medium">Creada por:</p>
                    {creator && (
                      <Link
                        href={`/profile/${creator.id}`}
                        className="mt-2 flex items-center gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{creator.name}</p>
                          <p className="text-sm text-muted-foreground">@{creator.username}</p>
                          <p className="text-xs text-primary mt-1">Ver perfil →</p>
                        </div>
                      </Link>
                    )}
                  </div>
                  {matchForJoin.isTeamMatch && (
                    <div>
                      <p className="font-medium">Equipos:</p>
                      <div className="mt-2 space-y-2">
                        {matchForJoin.team1Name && (
                          <div className="rounded-lg border p-3">
                            <p className="text-sm font-semibold">{matchForJoin.team1Name}</p>
                            {matchForJoin.team1Id && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  const team = teams.find((t) => t.id === matchForJoin.team1Id);
                                  if (team) {
                                    setSelectedTeamForModal(team);
                                    setTeamModalOpen(true);
                                  }
                                }}
                              >
                                Ver equipo →
                              </Button>
                            )}
                          </div>
                        )}
                        {matchForJoin.team2Name && (
                          <div className="rounded-lg border p-3">
                            <p className="text-sm font-semibold">{matchForJoin.team2Name}</p>
                            {matchForJoin.team2Id && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  const team = teams.find((t) => t.id === matchForJoin.team2Id);
                                  if (team) {
                                    setSelectedTeamForModal(team);
                                    setTeamModalOpen(true);
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
                      {new Date(matchForJoin.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <div className="mt-2 h-32 rounded-lg bg-muted"></div>
                    {matchForJoin.requiresApproval && (
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
  );
}
