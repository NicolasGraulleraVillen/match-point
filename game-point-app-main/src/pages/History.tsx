import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Sport, Level, HistoryMatch } from '@/types';
import { Calendar, Trophy, Info } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';
import { HistoryDetailsModal } from '@/components/HistoryDetailsModal';

export default function History() {
  const { history } = useApp();
  const [filterSport, setFilterSport] = useState<Sport | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<Level | 'all'>('all');
  const [selectedMatch, setSelectedMatch] = useState<HistoryMatch | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredHistory = history.filter((match) => {
    if (filterSport !== 'all' && match.sport !== filterSport) return false;
    if (filterLevel !== 'all' && match.level !== filterLevel) return false;
    return true;
  });

  const getBorderColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'border-l-highlight/60';
      case 'loss':
        return 'border-l-destructive/60';
      case 'draw':
        return 'border-l-muted-foreground/40';
      default:
        return '';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win':
        return 'Victoria';
      case 'loss':
        return 'Derrota';
      case 'draw':
        return 'Empate';
      default:
        return result;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Clean Header - Strava Style */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Historial</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Revisa tus partidos anteriores</p>
        </div>

        {/* Filters - Clean design */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={filterSport} onValueChange={(v) => setFilterSport(v as Sport | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por deporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los deportes</SelectItem>
              <SelectItem value="football">{getSportName('football')}</SelectItem>
              <SelectItem value="basketball">{getSportName('basketball')}</SelectItem>
              <SelectItem value="tennis">{getSportName('tennis')}</SelectItem>
              <SelectItem value="padel">{getSportName('padel')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLevel} onValueChange={(v) => setFilterLevel(v as Level | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="novato">Novato</SelectItem>
              <SelectItem value="intermedio">Intermedio</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List - Clean Strava-inspired cards */}
        {filteredHistory.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron partidos con estos filtros.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((match) => (
              <Card
                key={match.id}
                className={`border-l-4 bg-background/80 transition-all duration-200 hover:shadow-md ${getBorderColor(match.result)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mt-0.5">
                        <SportIcon sport={match.sport} className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base leading-tight">{getSportName(match.sport)}</h3>
                          <Badge variant="outline" className="capitalize text-xs">
                            {match.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">vs {match.opponent}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-lg font-bold">{match.score}</div>
                          <div className={`text-xs font-semibold ${
                            match.result === 'win' ? 'text-highlight' : 
                            match.result === 'loss' ? 'text-destructive' : 
                            'text-muted-foreground'
                          }`}>
                            {getResultText(match.result)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date and Action */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                          {new Date(match.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedMatch(match);
                          setDetailsOpen(true);
                        }}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <HistoryDetailsModal 
        match={selectedMatch} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />

      <MobileBottomNav />
    </div>
  );
}
