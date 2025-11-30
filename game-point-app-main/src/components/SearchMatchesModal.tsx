import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sport, Level } from '@/types';
import { toast } from 'sonner';
import { getSportName } from '@/utils/sportIcons';
import { Search } from 'lucide-react';

interface SearchMatchesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: { minDate: string; sport: Sport | 'all'; level: Level | 'all' }) => void;
}

export const SearchMatchesModal = ({ open, onOpenChange, onSearch }: SearchMatchesModalProps) => {
  const [minDate, setMinDate] = useState('');
  const [sport, setSport] = useState<Sport | 'all'>('all');
  const [level, setLevel] = useState<Level | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ minDate, sport, level });
    toast.success('Búsqueda aplicada');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscar Partidos
          </DialogTitle>
          <DialogDescription>
            Filtra los partidos disponibles por fecha, deporte y nivel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="min-date">Fecha mínima</Label>
            <Input
              id="min-date"
              type="date"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mostrar partidos desde esta fecha en adelante
            </p>
          </div>

          <div>
            <Label htmlFor="filter-sport">Deporte</Label>
            <Select value={sport} onValueChange={(v) => setSport(v as Sport | 'all')}>
              <SelectTrigger id="filter-sport">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los deportes</SelectItem>
                <SelectItem value="football">{getSportName('football')}</SelectItem>
                <SelectItem value="basketball">{getSportName('basketball')}</SelectItem>
                <SelectItem value="tennis">{getSportName('tennis')}</SelectItem>
                <SelectItem value="padel">{getSportName('padel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-level">Nivel</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as Level | 'all')}>
              <SelectTrigger id="filter-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="novato">Novato</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Buscar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
