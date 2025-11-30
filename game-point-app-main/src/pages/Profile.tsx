import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { Sport } from '@/types';
import { User, Trophy, TrendingUp, Target, Activity } from 'lucide-react';
import { SportIcon, getSportName } from '@/utils/sportIcons';

export default function Profile() {
  const { user, selectedSport, setSelectedSport } = useApp();
  const [viewSport, setViewSport] = useState<Sport>(selectedSport);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!user) return null;

  const stats = user.stats[viewSport];

  const StatCard = ({ label, value, max = 100 }: { label: string; value: number; max?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <Progress value={(value / max) * 100} className="h-2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Profile Header - Strava Style */}
        <Card className="mb-6 overflow-hidden border-border">
          <div className="h-20 md:h-24 bg-gradient-to-br from-primary to-primary/70" />
          <CardContent className="text-center relative pt-0 pb-6 px-4">
            {/* Profile Avatar */}
            <div className="relative -mt-10 md:-mt-12 mb-3">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 mx-auto border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl md:text-3xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <h1 className="text-2xl md:text-3xl font-bold mb-1.5">{user.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">
              {user.university}
            </p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
              <SportIcon sport={user.mainSport} className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{getSportName(user.mainSport)}</span>
            </div>

            {/* Stats Grid - Clean layout */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{user.points}</div>
                <div className="text-xs text-muted-foreground mt-1">Puntos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{stats.matches}</div>
                <div className="text-xs text-muted-foreground mt-1">Partidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-highlight">{stats.winRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">Victoria</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditModalOpen(true)}>
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Sport Selector */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Estadísticas por Deporte</h2>
          <Tabs value={viewSport} onValueChange={(v) => setViewSport(v as Sport)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto bg-muted/50">
              {(['football', 'basketball', 'tennis', 'padel'] as Sport[]).map((sport) => (
                <TabsTrigger 
                  key={sport} 
                  value={sport} 
                  className="flex flex-col items-center gap-1.5 py-3 data-[state=active]:bg-background"
                >
                  <SportIcon sport={sport} className="h-5 w-5" />
                  <span className="text-[11px] font-medium">{getSportName(sport)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards - Strava Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Partidos</span>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.matches}</div>
              <p className="text-xs text-muted-foreground">
                {stats.wins}V · {stats.losses}D
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Victoria</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mb-2">{stats.winRate}%</div>
              <Progress value={stats.winRate} className="h-1.5" />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Nivel</span>
                <SportIcon sport={viewSport} className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold capitalize mb-1">{user.levels[viewSport]}</div>
              <p className="text-xs text-muted-foreground">{stats.skillRating}/100</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Card */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Estadísticas - {getSportName(viewSport)}</CardTitle>
            <CardDescription className="text-sm">
              Tus habilidades según la gente contra la que has jugado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <StatCard label="Habilidad General" value={stats.skillRating} />
                <StatCard label="Resistencia" value={stats.stamina} />
              </div>
              <div className="space-y-3">
                <StatCard label="Técnica" value={stats.technique} />
                <StatCard label="Trabajo en Equipo" value={stats.teamwork} />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Deporte Principal
                </span>
                <Badge variant="outline" className="font-semibold">
                  <SportIcon sport={user.mainSport} className="h-3 w-3 mr-1" />
                  {getSportName(user.mainSport)}
                </Badge>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Cambiar Deporte Principal
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <MobileBottomNav />
      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
}
