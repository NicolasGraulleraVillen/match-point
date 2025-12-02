"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Añadido AvatarImage
import { useAuth } from "@/hooks/use-auth";
import { Toast } from "@/components/ui/toast";
import { getTeams, deleteTeam } from "@/lib/api-client";
import { Team } from "@/types";
import usersData from "@/data/users.json";
import { User } from "@/types";
import { Trash2, Users, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
  const { currentUser, isLoggedIn, loading } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadTeam();
    }
  }, [isLoggedIn, teamId]);

  const loadTeam = async () => {
    try {
      const teams = await getTeams();
      const foundTeam = teams.find((t) => t.id === teamId);
      if (foundTeam) {
        setTeam(foundTeam);
      } else {
        setToast({ message: "Equipo no encontrado", type: "error" });
        setTimeout(() => router.push("/profile"), 2000);
      }
    } catch (error) {
      setToast({ message: "Error al cargar el equipo", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!team) return;

    try {
      await deleteTeam(team.id);
      setToast({ message: "Equipo eliminado exitosamente", type: "success" });
      setTimeout(() => router.push("/profile"), 1500);
    } catch (error) {
      setToast({ message: "Error al eliminar el equipo", type: "error" });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const isCreator = currentUser && team?.createdBy === currentUser.id;
  const isMember = currentUser && team?.members.includes(currentUser.id);

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !team) return null;

  const teamMembers = (usersData as User[]).filter((u) => team.members.includes(u.id));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="flex-1 p-4 md:container md:mx-auto md:max-w-4xl md:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost">← Volver</Button>
          </Link>
          {isCreator && (
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          )}
        </div>

        {/* Team Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{team.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{team.sport}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {team.members.length}/{team.maxMembers} miembros
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-primary">{team.code}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          {team.description && (
            <CardContent>
              <p className="text-muted-foreground">{team.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Miembros del Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay miembros en el equipo</p>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const isTeamCreator = member.id === team.createdBy;
                  return (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {/* CÓDIGO MODIFICADO: Añadir AvatarImage */}
                          {/* Si member.avatar existe, muestra la imagen */}
                          {member.avatar && <AvatarImage src={member.avatar} alt={`@${member.username}'s avatar`} />}
                          {/* Si no hay avatar, muestra la inicial */}
                          <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {member.name}
                            {isTeamCreator && <span className="ml-2 text-xs text-muted-foreground">(Creador)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">@{member.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {!isMember && (
          <div className="mt-6">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground mb-4">¿Quieres unirte a este equipo?</p>
                <Link href={`/teams/join?code=${team.code}`}>
                  <Button className="w-full">Unirse con código: {team.code}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Match Button for Team Sports */}
        {isMember && (team.sport === "Fútbol" || team.sport === "Baloncesto") && (
          <div className="mt-6">
            <Link href={`/create?sport=${team.sport}&team=${team.id}`}>
              <Button className="w-full" size="lg">
                Crear Partido con este Equipo
              </Button>
            </Link>
          </div>
        )}
      </div>

      <MobileBottomNav />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Equipo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el equipo &quot;{team.name}&quot;? Esta acción no se puede deshacer.{" "}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
