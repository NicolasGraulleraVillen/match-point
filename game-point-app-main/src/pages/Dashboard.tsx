import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Sport, Match, Level } from '@/types';
import { Plus, Search, Users as UsersIcon, Loader2 } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';
import { CreateMatchModal } from '@/components/CreateMatchModal';
import { CreateTeamModal, JoinTeamModal } from '@/components/TeamModals';
import { MatchDetailsModal } from '@/components/MatchDetailsModal';
import { SearchMatchesModal } from '@/components/SearchMatchesModal';
import { MatchCard } from '@/components/MatchCard';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const { user, selectedSport, setSelectedSport, availableMatches, myMatches, joinMatch, leaveMatch, searchMatches, user: currentUser } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [joinTeamOpen, setJoinTeamOpen] = useState(false);
  const [matchDetailsOpen, setMatchDetailsOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [leaveMatchId, setLeaveMatchId] = useState<string | null>(null);
  const [joinMatchId, setJoinMatchId] = useState<string | null>(null);

  const handleSearch = async (filters: { minDate: string; sport: Sport | 'all'; level: Level | 'all' }) => {
    setIsSearching(true);
    await searchMatches(filters);
    setIsSearching(false);
  };

  const handleJoinMatch = (matchId: string) => {
    joinMatch(matchId);
    setJoinMatchId(null);
    setMatchDetailsOpen(false);
    toast.success('¡Te has unido al partido!');
  };

  const handleLeaveMatch = (matchId: string) => {
    leaveMatch(matchId);
    setLeaveMatchId(null);
    toast.success('Has abandonado el partido');
  };

  const handleViewDetails = (match: Match) => {
    setSelectedMatch(match);
    setMatchDetailsOpen(true);
  };

  const isTeamSport = selectedSport === 'football' || selectedSport === 'basketball';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Sport Selector - Clean Strava Style */}
        <div className="mb-6">
          <Tabs value={selectedSport} onValueChange={(v) => setSelectedSport(v as Sport)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto h-auto bg-muted/50">
              {(['football', 'basketball', 'tennis', 'padel'] as Sport[]).map((sport) => (
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
        <Card className="mb-6 border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold leading-tight mb-1 truncate">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {user.university} · {getSportName(selectedSport)}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-muted/50 rounded-md">
                  <span className="text-xs font-medium text-muted-foreground">Nivel</span>
                  <span className="text-xs font-semibold capitalize">{user.levels[selectedSport]}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-3xl font-bold text-primary leading-none">{user.points}</div>
                <div className="text-xs text-muted-foreground mt-1">Puntos</div>
              </div>
            </div>
          </CardContent>

          {/* Team Section for team sports */}
          {isTeamSport && (
            <CardContent className="pt-0 pb-5">
              {user.team ? (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UsersIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{user.team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.team.members.length} miembros · {user.team.code}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs flex-shrink-0">Ver</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setCreateTeamOpen(true)}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Crear
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setJoinTeamOpen(true)}>
                    <UsersIcon className="mr-1 h-3.5 w-3.5" />
                    Unirse
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Action Buttons - Strava Style */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            size="lg"
            onClick={() => setCreateModalOpen(true)}
            className="h-12 text-sm font-semibold"
          >
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
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Mis Partidos</h2>
          {myMatches.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No tienes partidos próximos
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {myMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isUserMatch
                  onLeave={() => setLeaveMatchId(match.id)}
                  onViewDetails={() => handleViewDetails(match)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Available Matches */}
        <section>
          <h2 className="text-lg font-bold mb-3">Partidos Disponibles</h2>
          {availableMatches.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No hay partidos disponibles
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onJoin={() => setJoinMatchId(match.id)}
                  onViewDetails={() => handleViewDetails(match)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <CreateMatchModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <SearchMatchesModal open={searchModalOpen} onOpenChange={setSearchModalOpen} onSearch={handleSearch} />
      <CreateTeamModal open={createTeamOpen} onOpenChange={setCreateTeamOpen} />
      <JoinTeamModal open={joinTeamOpen} onOpenChange={setJoinTeamOpen} />
      <MatchDetailsModal 
        match={selectedMatch} 
        open={matchDetailsOpen} 
        onOpenChange={setMatchDetailsOpen}
        onJoin={() => selectedMatch && setJoinMatchId(selectedMatch.id)}
      />

      {/* Join Confirmation */}
      <AlertDialog open={!!joinMatchId} onOpenChange={(open) => !open && setJoinMatchId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Unirse al partido?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirma que quieres unirte a este partido. Recibirás los detalles por email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => joinMatchId && handleJoinMatch(joinMatchId)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation */}
      <AlertDialog open={!!leaveMatchId} onOpenChange={(open) => !open && setLeaveMatchId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Abandonar partido?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres abandonar este partido? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leaveMatchId && handleLeaveMatch(leaveMatchId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Abandonar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileBottomNav />
    </div>
  );
}
