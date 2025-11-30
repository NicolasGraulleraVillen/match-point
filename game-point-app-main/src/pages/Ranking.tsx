import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/contexts/AppContext';
import { Sport, University } from '@/types';
import { Trophy, Medal, User } from 'lucide-react';
import { getSportName } from '@/utils/sportIcons';

export default function Ranking() {
  const { rankings, user } = useApp();
  const [filterSport, setFilterSport] = useState<Sport>(user?.mainSport || 'football');
  const [filterUniversity, setFilterUniversity] = useState<University | 'all'>(user?.university || 'all');

  // Filter rankings by sport and university
  const filteredRankings = rankings
    .filter((entry) => {
      if (entry.sport !== filterSport) return false;
      if (filterUniversity !== 'all' && entry.university !== filterUniversity) return false;
      return true;
    })
    // Recalculate positions based on filtered results
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold">{position}º</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Clean Header - Strava Style */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ranking</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Compara tu rendimiento con otros jugadores</p>
        </div>

        {/* Filters - Clean design */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={filterSport} onValueChange={(v) => setFilterSport(v as Sport)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por deporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">{getSportName('football')}</SelectItem>
              <SelectItem value="basketball">{getSportName('basketball')}</SelectItem>
              <SelectItem value="tennis">{getSportName('tennis')}</SelectItem>
              <SelectItem value="padel">{getSportName('padel')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterUniversity} onValueChange={(v) => setFilterUniversity(v as University | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por universidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las universidades</SelectItem>
              <SelectItem value="U-tad">U-tad</SelectItem>
              <SelectItem value="Complutense">Complutense</SelectItem>
              <SelectItem value="Politécnica">Politécnica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ranking Table - Clean Strava-inspired design */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Posición</TableHead>
                  <TableHead>Jugador</TableHead>
                  <TableHead className="hidden sm:table-cell">Universidad</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Partidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRankings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay datos para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRankings.map((entry) => {
                    const isCurrentUser = user?.id === entry.userId;
                    return (
                      <TableRow
                        key={entry.userId}
                        className={isCurrentUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center">
                            {getMedalIcon(entry.position)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className={`font-semibold ${isCurrentUser ? 'text-primary' : ''}`}>
                                {entry.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    Tú
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground sm:hidden">{entry.university}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {entry.university}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">{entry.points}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                          {entry.matchesPlayed}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
      
      <MobileBottomNav />
    </div>
  );
}
