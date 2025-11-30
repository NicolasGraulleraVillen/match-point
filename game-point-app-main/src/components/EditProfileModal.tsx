import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sport, University, Level } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { getSportName } from '@/utils/sportIcons';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const { user, updateUserProfile } = useApp();
  
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState<University>(user?.university || 'U-tad');
  const [mainSport, setMainSport] = useState<Sport>(user?.mainSport || 'football');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    updateUserProfile({
      name,
      university,
      mainSport,
    });

    toast.success('Perfil actualizado correctamente');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y deportiva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>

          {/* University */}
          <div className="space-y-2">
            <Label htmlFor="university">Universidad</Label>
            <Select value={university} onValueChange={(v) => setUniversity(v as University)}>
              <SelectTrigger id="university">
                <SelectValue placeholder="Selecciona tu universidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="U-tad">U-tad</SelectItem>
                <SelectItem value="Complutense">Complutense</SelectItem>
                <SelectItem value="Politécnica">Politécnica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Sport */}
          <div className="space-y-2">
            <Label htmlFor="mainSport">Deporte Principal</Label>
            <Select value={mainSport} onValueChange={(v) => setMainSport(v as Sport)}>
              <SelectTrigger id="mainSport">
                <SelectValue placeholder="Selecciona tu deporte principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">{getSportName('football')}</SelectItem>
                <SelectItem value="basketball">{getSportName('basketball')}</SelectItem>
                <SelectItem value="tennis">{getSportName('tennis')}</SelectItem>
                <SelectItem value="padel">{getSportName('padel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password (optional) */}
          <div className="space-y-2">
            <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar en blanco para mantener actual"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
