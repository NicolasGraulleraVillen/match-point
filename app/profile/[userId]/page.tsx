"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, GraduationCap, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { getUsers } from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTeams } from "@/lib/api-client";
import { Team } from "@/types";
import Image from "next/image";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const userId = params.userId as string;
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUser();
      loadTeams();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      const users = await getUsers();
      const foundUser = users.find((u) => u.id === userId);
      setUser(foundUser || null);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const allTeams = await getTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Usuario no encontrado</p>
          <Button onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const userTeams = teams.filter((t) => t.members.includes(user.id));
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      {/* Cover Photo */}
      <div className="relative h-48 w-full md:h-64 rounded-lg mb-6 overflow-hidden">
        <Image src={user.coverPhoto || "/images/cover-default.jpg"} alt="Cover" fill className="object-cover" />
      </div>

      <div className="flex-1 p-4 md:container md:mx-auto md:max-w-4xl md:py-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4 md:mb-6">
          <Link href="/home">
            <Button variant="ghost" size="icon" type="button" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Perfil</h1>
        </div>

        {/* Profile Header */}
        <div className="relative mb-6 md:mt-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <Avatar className="h-24 w-24 border-4 border-background md:h-32 md:w-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl md:text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold md:text-3xl">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{user.age} años</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{user.points} puntos</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{user.course}</div>
            </div>
            {isOwnProfile && (
              <Link href="/profile">
                <Button variant="outline">Mi Perfil</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Deportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.sports.map((sport) => (
                <span key={sport} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {sport}
                </span>
              ))}
            </div>
            {user.pairSports.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">Deportes en pareja:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.pairSports.map((sport) => (
                    <span key={sport} className="rounded-full bg-secondary px-3 py-1 text-sm">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teams */}
        {userTeams.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Equipos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {team.sport} • Código: {team.code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {team.members.length}/{team.maxMembers} miembros
                        </p>
                      </div>
                      {team.createdBy === user.id && (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Creador
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="futbol">Fútbol</TabsTrigger>
            <TabsTrigger value="baloncesto">Baloncesto</TabsTrigger>
            <TabsTrigger value="tenis">Tenis</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.points}</div>
                    <div className="text-sm text-muted-foreground">Puntos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.wins || 0}</div>
                    <div className="text-sm text-muted-foreground">Victorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.losses || 0}</div>
                    <div className="text-sm text-muted-foreground">Derrotas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.matches || 0}</div>
                    <div className="text-sm text-muted-foreground">Partidos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="futbol" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user.sportProfiles?.["Fútbol"]?.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">Biografía</h3>
                      <p className="text-sm text-muted-foreground">{user.sportProfiles["Fútbol"].bio}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.wins || 0}</div>
                      <div className="text-xs text-muted-foreground">Victorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.losses || 0}</div>
                      <div className="text-xs text-muted-foreground">Derrotas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Fútbol"]?.stats?.matches || 0}</div>
                      <div className="text-xs text-muted-foreground">Partidos</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="baloncesto" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user.sportProfiles?.["Baloncesto"]?.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">Biografía</h3>
                      <p className="text-sm text-muted-foreground">{user.sportProfiles["Baloncesto"].bio}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Baloncesto"]?.stats?.wins || 0}</div>
                      <div className="text-xs text-muted-foreground">Victorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Baloncesto"]?.stats?.losses || 0}</div>
                      <div className="text-xs text-muted-foreground">Derrotas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Baloncesto"]?.stats?.matches || 0}</div>
                      <div className="text-xs text-muted-foreground">Partidos</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenis" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user.sportProfiles?.["Tenis"]?.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">Biografía</h3>
                      <p className="text-sm text-muted-foreground">{user.sportProfiles["Tenis"].bio}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Tenis"]?.stats?.wins || 0}</div>
                      <div className="text-xs text-muted-foreground">Victorias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Tenis"]?.stats?.losses || 0}</div>
                      <div className="text-xs text-muted-foreground">Derrotas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{user.sportProfiles?.["Tenis"]?.stats?.matches || 0}</div>
                      <div className="text-xs text-muted-foreground">Partidos</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  );
}
