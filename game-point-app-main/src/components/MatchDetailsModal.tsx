import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types';
import { Calendar, MapPin, Users, DollarSign, User } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';
import { Separator } from '@/components/ui/separator';

interface MatchDetailsModalProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin?: () => void;
  isUserMatch?: boolean;
}

// Helper to generate user name from ID
const getUserDisplayName = (userId: string, index: number): string => {
  const names = ['Juan García', 'María López', 'Carlos Martínez', 'Ana Rodríguez', 'David Sánchez', 
                 'Laura Fernández', 'Pablo González', 'Sara Díaz', 'Miguel Torres', 'Elena Ruiz'];
  return names[index % names.length];
};

export const MatchDetailsModal = ({ match, open, onOpenChange, onJoin, isUserMatch }: MatchDetailsModalProps) => {
  if (!match) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'novato':
        return 'bg-secondary text-secondary-foreground';
      case 'intermedio':
        return 'bg-highlight text-highlight-foreground';
      case 'pro':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <SportIcon sport={match.sport} className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-2xl">{getSportName(match.sport)}</DialogTitle>
              <DialogDescription className="capitalize">{formatDate(match.date)}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Creator Comments */}
          {match.creatorComments && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-1">Comentarios del organizador:</p>
              <p className="text-sm text-foreground">{match.creatorComments}</p>
            </div>
          )}

          {/* Match Details */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nivel Requerido</span>
              <Badge className={getLevelColor(match.requiredLevel)}>
                {match.requiredLevel}
              </Badge>
            </div>
            
            <Separator />

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{match.time}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{match.location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {match.participants.length}/{match.maxParticipants} jugadores
              </span>
            </div>

            {match.cost && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{match.cost}€ por persona</span>
              </div>
            )}
          </div>

          {/* Participants List */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participantes ({match.participants.length})
            </h3>
            <div className="space-y-2">
              {match.participants.map((participantId, index) => {
                const displayName = getUserDisplayName(participantId, index);
                const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                
                return (
                  <div
                    key={participantId}
                    className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Nivel {index === 0 ? match.requiredLevel : ['novato', 'intermedio', 'pro'][index % 3]}
                      </p>
                    </div>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Organizador
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty Slots */}
          {match.participants.length < match.maxParticipants && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Espacios disponibles</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: match.maxParticipants - match.participants.length }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                  >
                    <User className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isUserMatch && onJoin && match.participants.length < match.maxParticipants && (
            <Button onClick={onJoin} className="w-full" size="lg">
              Unirse al Partido
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
