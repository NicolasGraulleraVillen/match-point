"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSportName } from "@/lib/sport-utils";
import usersData from "@/data/users.json";
import { User as UserType } from "@/types";

export default function RankingPage() {
  const { isLoggedIn, loading, currentUser } = useAuth();
  const mainSport = currentUser?.mainSport || currentUser?.sports?.[0] || "Fútbol";
  const [selectedSport, setSelectedSport] = useState(mainSport);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");

  // Update selectedSport when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const newMainSport = currentUser.mainSport || currentUser.sports?.[0] || "Fútbol";
      if (newMainSport !== selectedSport) {
        setSelectedSport(newMainSport);
      }
    }
  }, [currentUser?.mainSport, currentUser?.sports]);

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

  if (!isLoggedIn) return null;

  // Calculate rankings by sport - using sportProfiles points
  const getSportPoints = (user: UserType, sport: string): number => {
    return user.sportProfiles?.[sport]?.stats?.matches
      ? (user.sportProfiles[sport].stats.wins || 0) * 10 + (user.sportProfiles[sport].stats.matches || 0) * 2
      : 0;
  };

  // Filter and sort users by sport-specific points
  const sortedUsers = [...(usersData as UserType[])]
    .filter((user) => {
      if (selectedUniversity !== "all" && user.university !== selectedUniversity) return false;
      return true;
    })
    .map((user) => ({
      ...user,
      sportPoints: getSportPoints(user, selectedSport),
    }))
    .sort((a, b) => b.sportPoints - a.sportPoints);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold">{position}º</span>;
    }
  };

  // Get unique universities
  const universities = Array.from(new Set((usersData as UserType[]).map((u) => u.university)));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Clean Header - Strava Style */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ranking</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Compara tu rendimiento con otros jugadores</p>
        </div>

        {/* Filters - Clean design */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por deporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fútbol">{getSportName("Fútbol")}</SelectItem>
              <SelectItem value="Baloncesto">{getSportName("Baloncesto")}</SelectItem>
              <SelectItem value="Tenis">{getSportName("Tenis")}</SelectItem>
              <SelectItem value="Pádel">{getSportName("Pádel")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por universidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las universidades</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ranking Table - Clean Strava-inspired design */}
        <Card className="border-border overflow-hidden">
          <CardHeader>
            <CardTitle>Top Jugadores - {getSportName(selectedSport)}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold w-20">Pos</th>
                    <th className="text-left p-4 font-semibold">Jugador</th>
                    <th className="text-left p-4 font-semibold hidden sm:table-cell">Universidad</th>
                    <th className="text-right p-4 font-semibold">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        No hay datos para mostrar
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((user, index) => {
                      const isCurrentUser = currentUser?.id === user.id;
                      return (
                        <tr
                          key={user.id}
                          className={`border-b transition-colors hover:bg-muted/50 ${
                            isCurrentUser ? "bg-primary/5 border-l-4 border-l-primary" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center justify-center">{getMedalIcon(index + 1)}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() ?? "U"}</AvatarFallback>{" "}
                              </Avatar>
                              <div>
                                <div className={`font-semibold ${isCurrentUser ? "text-primary" : ""}`}>
                                  {user.name}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                      Tú
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground sm:hidden">{user.university}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground hidden sm:table-cell">{user.university}</td>
                          <td className="p-4 text-right">
                            <div className="font-bold text-primary">{user.sportPoints}</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  );
}
