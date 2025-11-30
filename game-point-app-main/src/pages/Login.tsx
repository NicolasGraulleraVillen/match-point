import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Sport, Level, University } from '@/types';
import { getSportName } from '@/utils/sportIcons';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerSport, setRegisterSport] = useState<Sport>('football');
  const [registerLevel, setRegisterLevel] = useState<Level>('intermedio');
  const [registerUniversity, setRegisterUniversity] = useState<University>('U-tad');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Validate credentials against mock users
    const mockUsers = [
      {
        email: 'jaime@example.com',
        password: '123456',
        user: {
          id: 'user-jaime',
          name: 'Jaime',
          email: 'jaime@example.com',
          university: 'Complutense' as const,
          mainSport: 'basketball' as const,
          levels: {
            football: 'intermedio' as const,
            basketball: 'pro' as const,
            tennis: 'novato' as const,
            padel: 'intermedio' as const,
          },
          matches: [],
          points: 1450,
          stats: {
            football: { matches: 30, wins: 18, losses: 12, winRate: 60, skillRating: 75, stamina: 78, technique: 73, teamwork: 80 },
            basketball: { matches: 50, wins: 38, losses: 12, winRate: 76, skillRating: 92, stamina: 90, technique: 88, teamwork: 95 },
            tennis: { matches: 10, wins: 4, losses: 6, winRate: 40, skillRating: 62, stamina: 65, technique: 60, teamwork: 58 },
            padel: { matches: 20, wins: 12, losses: 8, winRate: 60, skillRating: 74, stamina: 72, technique: 75, teamwork: 78 },
          },
        }
      },
      {
        email: 'carlos@utad.com',
        password: '123456',
        user: {
          id: 'user-1',
          name: 'Carlos Martínez',
          email: 'carlos@utad.com',
          university: 'U-tad' as const,
          mainSport: 'football' as const,
          levels: {
            football: 'pro' as const,
            basketball: 'intermedio' as const,
            tennis: 'novato' as const,
            padel: 'intermedio' as const,
          },
          matches: [],
          points: 1250,
          stats: {
            football: { matches: 45, wins: 32, losses: 13, winRate: 71, skillRating: 88, stamina: 85, technique: 90, teamwork: 92 },
            basketball: { matches: 20, wins: 12, losses: 8, winRate: 60, skillRating: 75, stamina: 80, technique: 72, teamwork: 78 },
            tennis: { matches: 8, wins: 3, losses: 5, winRate: 38, skillRating: 65, stamina: 70, technique: 68, teamwork: 60 },
            padel: { matches: 15, wins: 9, losses: 6, winRate: 60, skillRating: 72, stamina: 75, technique: 70, teamwork: 80 },
          },
        }
      }
    ];

    const foundUser = mockUsers.find(u => u.email === loginEmail && u.password === loginPassword);

    if (!foundUser) {
      toast.error('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
      return;
    }

    setUser(foundUser.user);
    toast.success('¡Bienvenido de vuelta!');
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerEmail || !registerPassword || !registerName) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Mock register
    const newUser = {
      id: `user-${Date.now()}`,
      name: registerName,
      email: registerEmail,
      university: registerUniversity,
      mainSport: registerSport,
      levels: {
        football: registerLevel,
        basketball: registerLevel,
        tennis: registerLevel,
        padel: registerLevel,
      },
      matches: [],
      points: 0,
      stats: {
        football: { matches: 0, wins: 0, losses: 0, winRate: 0, skillRating: 60, stamina: 60, technique: 60, teamwork: 60 },
        basketball: { matches: 0, wins: 0, losses: 0, winRate: 0, skillRating: 60, stamina: 60, technique: 60, teamwork: 60 },
        tennis: { matches: 0, wins: 0, losses: 0, winRate: 0, skillRating: 60, stamina: 60, technique: 60, teamwork: 60 },
        padel: { matches: 0, wins: 0, losses: 0, winRate: 0, skillRating: 60, stamina: 60, technique: 60, teamwork: 60 },
      },
    };

    setUser(newUser);
    toast.success('¡Cuenta creada con éxito!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">
              Match<span className="text-primary">Point</span>
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>Inicia sesión o crea una cuenta para empezar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Nombre Completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-university">Universidad</Label>
                    <Select value={registerUniversity} onValueChange={(v) => setRegisterUniversity(v as University)}>
                      <SelectTrigger id="register-university">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="U-tad">U-tad</SelectItem>
                        <SelectItem value="Complutense">Complutense</SelectItem>
                        <SelectItem value="Politécnica">Politécnica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="register-sport">Deporte Principal</Label>
                    <Select value={registerSport} onValueChange={(v) => setRegisterSport(v as Sport)}>
                      <SelectTrigger id="register-sport">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="football">{getSportName('football')}</SelectItem>
                        <SelectItem value="basketball">{getSportName('basketball')}</SelectItem>
                        <SelectItem value="tennis">{getSportName('tennis')}</SelectItem>
                        <SelectItem value="padel">{getSportName('padel')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="register-level">Nivel</Label>
                    <Select value={registerLevel} onValueChange={(v) => setRegisterLevel(v as Level)}>
                      <SelectTrigger id="register-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novato">Novato</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
