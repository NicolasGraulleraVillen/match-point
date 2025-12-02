"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Trophy, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { HistoryMatch, Level } from "@/types";
import { SportIcon, getSportName } from "@/lib/sport-utils";
import { HistoryDetailsModal } from "@/components/history-details-modal";

export default function HistorialPage() {
  const router = useRouter();
  const { isLoggedIn, loading, currentUser } = useAuth();
  const [history, setHistory] = useState<HistoryMatch[]>([]);
  const [filterSport, setFilterSport] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<Level | "all">("all");
  const [selectedMatch, setSelectedMatch] = useState<HistoryMatch | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      loadHistory();
    }
  }, [isLoggedIn, currentUser]);

  const loadHistory = async () => {
    try {
      // Cargar partidos desde la API
      const response = await fetch("/api/matches");
      if (response.ok) {
        const matches = await response.json();

        // Ciclo de resultados y marcadores coherentes
        const resultCycle: ("win" | "loss" | "draw")[] = ["win", "loss", "draw"];
        const scoreByResult: Record<"win" | "loss" | "draw", string[]> = {
          win: ["3-1", "2-0", "4-2", "5-3", "1-0"],
          loss: ["1-3", "0-2", "2-4", "3-5", "0-1"],
          draw: ["1-1", "2-2", "0-0"],
        };

        // Convertir partidos completados al formato de historial
        const completedMatches = matches
          .filter(
            (m: any) =>
              m.status === "completed" && (m.players.includes(currentUser!.id) || m.createdBy === currentUser!.id)
          )
          .map((m: any, index: number) => {
            const opponents = matches
              .filter((other: any) => other.id !== m.id && other.sport === m.sport)
              .map((other: any) => other.createdByName);

            const result = resultCycle[index % resultCycle.length];
            const scoresForResult = scoreByResult[result];
            const score = scoresForResult[index % scoresForResult.length];

            return {
              id: m.id,
              sport: m.sport,
              date: m.date,
              opponent: opponents[0] || "Equipo Rival",
              result,
              score,
              level: (["novato", "intermedio", "pro"] as Level[])[index % 3],
              location: m.location?.address || "Ubicación no especificada",
            } as HistoryMatch;
          });

        setHistory(completedMatches);
      }
    } catch (error) {
      console.error("Error loading history:", error);
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

  if (!isLoggedIn) {
    router.push("/");
    return null;
  }

  const filteredHistory = history.filter((match) => {
    if (filterSport !== "all" && match.sport !== filterSport) return false;
    if (filterLevel !== "all" && match.level !== filterLevel) return false;
    return true;
  });

  const getBorderColor = (result: string) => {
    switch (result) {
      case "win":
        return "border-l-green-500/60";
      case "loss":
        return "border-l-red-500/60";
      case "draw":
        return "border-l-yellow-500/60";
      default:
        return "";
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "win":
        return "Victoria";
      case "loss":
        return "Derrota";
      case "draw":
        return "Empate";
      default:
        return result;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Historial</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Revisa tus partidos anteriores</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={filterSport} onValueChange={setFilterSport}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por deporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los deportes</SelectItem>
              <SelectItem value="Fútbol">Fútbol</SelectItem>
              <SelectItem value="Baloncesto">Baloncesto</SelectItem>
              <SelectItem value="Tenis">Tenis</SelectItem>
              <SelectItem value="Pádel">Pádel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLevel} onValueChange={(v) => setFilterLevel(v as Level | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="novato">Novato</SelectItem>
              <SelectItem value="intermedio">Intermedio</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron partidos con estos filtros.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((match) => (
              <Card
                key={match.id}
                className={`border-l-4 bg-background/80 transition-all duration-200 hover:shadow-md ${getBorderColor(
                  match.result
                )}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mt-0.5">
                        <SportIcon sport={match.sport} className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base leading-tight">{getSportName(match.sport)}</h3>
                          <Badge variant="outline" className="capitalize text-xs">
                            {match.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">vs {match.opponent}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-lg font-bold">{match.score}</div>
                          <div
                            className={`text-xs font-semibold ${
                              match.result === "win"
                                ? "text-green-600"
                                : match.result === "loss"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {getResultText(match.result)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date and Action */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                          {new Date(match.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedMatch(match);
                          setDetailsOpen(true);
                        }}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />

      <HistoryDetailsModal match={selectedMatch} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
}
