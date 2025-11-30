import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Level } from '@/types';
import { toast } from 'sonner';
import { getSportName } from '@/utils/sportIcons';

interface CreateMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateMatchModal = ({ open, onOpenChange }: CreateMatchModalProps) => {
  const { selectedSport, createMatch } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState<Level>('intermedio');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !location) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    createMatch({
      sport: selectedSport,
      date,
      time,
      location,
      requiredLevel: level,
      maxParticipants: parseInt(maxParticipants),
      cost: 5,
      status: 'upcoming',
      creatorComments: comments || undefined,
    });

    toast.success('¡Partido creado con éxito!');
    onOpenChange(false);

    // Reset form
    setDate('');
    setTime('');
    setLocation('');
    setLevel('intermedio');
    setMaxParticipants('10');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Partido</DialogTitle>
          <DialogDescription>Organiza un nuevo partido de {getSportName(selectedSport)}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="match-date">Fecha</Label>
            <Input
              id="match-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="match-time">Hora</Label>
            <Input
              id="match-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="match-location">Ubicación</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="match-location">
                <SelectValue placeholder="Selecciona una pista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Polideportivo U-tad">Polideportivo U-tad</SelectItem>
                <SelectItem value="Campo Municipal">Campo Municipal</SelectItem>
                <SelectItem value="Pabellón Complutense">Pabellón Complutense</SelectItem>
                <SelectItem value="Centro Deportivo">Centro Deportivo</SelectItem>
                <SelectItem value="Instalaciones Politécnica">Instalaciones Politécnica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="match-level">Nivel Requerido</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
              <SelectTrigger id="match-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novato">Novato</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="match-participants">Máximo de Participantes</Label>
            <Input
              id="match-participants"
              type="number"
              min="2"
              max="22"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="match-comments">Comentarios (opcional)</Label>
            <Input
              id="match-comments"
              type="text"
              placeholder="Ej: Faltan pelotas, traed agua..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Máximo 100 caracteres
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Crear Partido
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
