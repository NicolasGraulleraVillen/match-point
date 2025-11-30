import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';

interface MatchCardProps {
  match: Match;
  onJoin?: () => void;
  onLeave?: () => void;
  onViewDetails?: () => void;
  isUserMatch?: boolean;
}

export const MatchCard = ({ match, onJoin, onLeave, onViewDetails, isUserMatch }: MatchCardProps) => {
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
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <Card className="group border border-border bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-200">
      <CardContent className="p-4 space-y-4">
        {/* Header with Sport and Level */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <SportIcon sport={match.sport} className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate">{getSportName(match.sport)}</h3>
              <p className="text-sm text-muted-foreground capitalize truncate">{formatDate(match.date)}</p>
            </div>
          </div>
          <Badge variant="outline" className={getLevelColor(match.requiredLevel)}>
            {match.requiredLevel}
          </Badge>
        </div>

        {/* Details Grid - Strava inspired clean layout */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{match.time}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{match.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              <span className="font-semibold text-foreground">{match.participants.length}</span>
              <span className="text-muted-foreground">/{match.maxParticipants}</span> jugadores
            </span>
          </div>
          {match.cost && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span><span className="font-semibold text-foreground">{match.cost}€</span> por persona</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button variant="outline" onClick={onViewDetails} size="sm" className="flex-1 text-sm">
              Detalles
            </Button>
          )}
          {isUserMatch && onLeave && (
            <Button variant="destructive" onClick={onLeave} size="sm" className="flex-1 text-sm">
              Abandonar
            </Button>
          )}
          {!isUserMatch && onJoin && (
            <Button onClick={onJoin} size="sm" className="flex-1 text-sm font-semibold">
              Unirse
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
