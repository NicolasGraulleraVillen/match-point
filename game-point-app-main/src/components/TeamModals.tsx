import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Users, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { mockRankings, mockTeams } from '@/mocks/data';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTeamModal = ({ open, onOpenChange }: CreateTeamModalProps) => {
  const { selectedSport, createTeam } = useApp();
  const [teamName, setTeamName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const isTeamSport = selectedSport === 'football' || selectedSport === 'basketball';
  const requiredMembers = selectedSport === 'football' ? 7 : 5;
  
  // Get available users from rankings (filter by selected sport)
  const availableUsers = mockRankings.filter(u => u.sport === selectedSport).slice(0, 20);

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      if (selectedUsers.length < requiredMembers) {
        setSelectedUsers([...selectedUsers, userId]);
      } else {
        toast.error(`Solo puedes seleccionar ${requiredMembers} miembros para ${selectedSport}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isTeamSport) {
      toast.error('Solo puedes crear equipos para fútbol o baloncesto');
      return;
    }

    if (!teamName.trim()) {
      toast.error('Por favor ingresa un nombre para el equipo');
      return;
    }

    if (selectedUsers.length !== requiredMembers) {
      toast.error(`Debes seleccionar exactamente ${requiredMembers} miembros`);
      return;
    }

    createTeam(teamName, selectedSport, selectedUsers);
    toast.success(`Equipo "${teamName}" creado exitosamente`);
    onOpenChange(false);
    setTeamName('');
    setSelectedUsers([]);
  };

  if (!isTeamSport) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Crear Equipo
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No se pueden crear equipos para {selectedSport}.</p>
            <p className="text-sm mt-2">Solo disponible para fútbol y baloncesto.</p>
          </div>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Crear Equipo
          </DialogTitle>
          <DialogDescription>
            Crea un equipo de {selectedSport}. Debes seleccionar exactamente {requiredMembers} miembros.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="team-name">Nombre del Equipo</Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Los Campeones"
              required
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedUsers.length}/{requiredMembers} miembros seleccionados
            </p>
          </div>

          <div>
            <Label>Seleccionar Miembros</Label>
            <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/20">
              {availableUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.userId);
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                
                return (
                  <div
                    key={user.userId}
                    onClick={() => toggleUser(user.userId)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-background hover:bg-muted/40 border-2 border-transparent'
                    }`}
                  >
                    <Checkbox checked={isSelected} />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.university} · {user.points} pts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Crear Equipo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface JoinTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinTeamModal = ({ open, onOpenChange }: JoinTeamModalProps) => {
  const { joinTeam, selectedSport } = useApp();
  const [teamCode, setTeamCode] = useState('');
  const [showRecommended, setShowRecommended] = useState(true);

  // Get 5 random recommended teams for the selected sport
  const recommendedTeams = mockTeams
    .filter(t => t.sport === selectedSport)
    .slice(0, 5);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCode.trim()) {
      toast.error('Por favor ingresa el código del equipo');
      return;
    }

    const team = mockTeams.find(t => t.code.toUpperCase() === teamCode.toUpperCase());
    
    if (!team) {
      toast.error('Código de equipo inválido');
      return;
    }

    if (team.sport !== selectedSport) {
      toast.error(`Este equipo es de ${team.sport}, no de ${selectedSport}`);
      return;
    }

    joinTeam(teamCode.toUpperCase());
    toast.success(`Te has unido a "${team.name}" exitosamente`);
    onOpenChange(false);
    setTeamCode('');
  };

  const handleJoinTeam = (code: string) => {
    const team = mockTeams.find(t => t.code === code);
    if (team) {
      joinTeam(code);
      toast.success(`Te has unido a "${team.name}" exitosamente`);
      onOpenChange(false);
    }
  };

  const isTeamSport = selectedSport === 'football' || selectedSport === 'basketball';

  if (!isTeamSport) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Unirse a Equipo
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No hay equipos disponibles para {selectedSport}.</p>
            <p className="text-sm mt-2">Solo disponible para fútbol y baloncesto.</p>
          </div>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Unirse a Equipo
          </DialogTitle>
          <DialogDescription>
            Explora equipos recomendados o únete usando un código de invitación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search by code */}
          <form onSubmit={handleJoinByCode} className="space-y-3">
            <Label htmlFor="team-code">Buscar por Código</Label>
            <div className="flex gap-2">
              <Input
                id="team-code"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="Ej: TIG123"
                maxLength={6}
                className="uppercase flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Código de 6 caracteres proporcionado por el equipo
            </p>
          </form>

          {/* Recommended teams */}
          {recommendedTeams.length > 0 && (
            <div>
              <Label className="mb-3 block">Equipos Recomendados</Label>
              <div className="space-y-2">
                {recommendedTeams.map((team) => (
                  <Card key={team.id} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{team.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {team.members.length} miembros · Código: {team.code}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinTeam(team.code)}
                          className="flex-shrink-0"
                        >
                          Unirse
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
