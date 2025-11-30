import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HistoryMatch } from '@/types';
import { MapPin, Users, Trophy } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';
import { Separator } from '@/components/ui/separator';

interface HistoryDetailsModalProps {
  match: HistoryMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to generate mock participants
const generateParticipants = (count: number) => {
  const names = ['Juan García', 'María López', 'Carlos Martínez', 'Ana Rodríguez', 'David Sánchez', 
                 'Laura Fernández', 'Pablo González', 'Sara Díaz'];
  return names.slice(0, count).map((name, i) => ({
    id: `participant-${i}`,
    name,
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase()
  }));
};

// Mock locations based on sport
const getLocation = (sport: string): string => {
  const locations: Record<string, string> = {
    football: 'Polideportivo U-tad',
    basketball: 'Pabellón Complutense',
    tennis: 'Club de Tenis Municipal',
    padel: 'Centro Deportivo U-tad'
  };
  return locations[sport] || 'Centro Deportivo';
};

export const HistoryDetailsModal = ({ match, open, onOpenChange }: HistoryDetailsModalProps) => {
  if (!match) return null;

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'bg-highlight text-highlight-foreground';
      case 'loss':
        return 'bg-destructive text-destructive-foreground';
      case 'draw':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win': return 'Victoria';
      case 'loss': return 'Derrota';
      case 'draw': return 'Empate';
      default: return result;
    }
  };

  const participantCount = match.sport === 'football' ? 6 : match.sport === 'basketball' ? 4 : 2;
  const participants = generateParticipants(participantCount);
  const location = getLocation(match.sport);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <SportIcon sport={match.sport} className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-2xl">{getSportName(match.sport)}</DialogTitle>
              <DialogDescription className="capitalize">
                {new Date(match.date).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Result */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-3xl font-bold">{match.score}</div>
                <Badge className={`${getResultColor(match.result)} mt-2`}>
                  {getResultText(match.result)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nivel</span>
              <Badge variant="outline" className="capitalize">
                {match.level}
              </Badge>
            </div>
            
            <Separator />

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>vs {match.opponent}</span>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participantes ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {participant.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{participant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Nivel {match.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
