"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Team, User } from "@/types"
import { Users, Trophy, Calendar, X, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { updateTeam, deleteTeam } from "@/lib/api-client"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TeamDetailsModalProps {
  team: Team | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: User | null
  teamMembers: User[]
  onUpdate: () => void
}

export function TeamDetailsModal({
  team,
  open,
  onOpenChange,
  currentUser,
  teamMembers,
  onUpdate,
}: TeamDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [teamName, setTeamName] = useState(team?.name || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)

  if (!team) return null

  const isCreator = currentUser?.id === team.createdBy
  const isMember = currentUser && team.members.includes(currentUser.id)

  const handleUpdateName = async () => {
    if (!teamName.trim()) {
      toast.error("El nombre no puede estar vacío")
      return
    }

    try {
      await updateTeam(team.id, { name: teamName })
      toast.success("Nombre del equipo actualizado")
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      toast.error("Error al actualizar el nombre")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!isCreator) return

    try {
      const updatedMembers = team.members.filter((id) => id !== memberId)
      await updateTeam(team.id, { members: updatedMembers })
      toast.success("Miembro expulsado del equipo")
      setMemberToRemove(null)
      onUpdate()
    } catch (error) {
      toast.error("Error al expulsar al miembro")
    }
  }

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(team.id)
      toast.success("Equipo eliminado")
      onOpenChange(false)
      onUpdate()
    } catch (error) {
      toast.error("Error al eliminar el equipo")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="h-8"
                      />
                      <Button size="sm" onClick={handleUpdateName}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditing(false)
                          setTeamName(team.name)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <DialogTitle className="text-2xl">{team.name}</DialogTitle>
                      {isCreator && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsEditing(true)}
                          className="mt-1"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Editar nombre
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              {isCreator && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <DialogDescription>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{team.sport}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{team.members.length}/{team.maxMembers} miembros</span>
                </div>
                <div>
                  <span className="font-mono font-bold text-primary">{team.code}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {team.description && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Miembros ({teamMembers.length})
              </h3>
              <div className="space-y-2">
                {teamMembers.map((member) => {
                  const isTeamCreator = member.id === team.createdBy
                  const canRemove = isCreator && member.id !== team.createdBy

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <Link
                        href={`/profile/${member.id}`}
                        className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                      >
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {member.name}
                            {isTeamCreator && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (Creador)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{member.username}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${member.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                          >
                            Ver perfil
                          </Button>
                        </Link>
                        {canRemove && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setMemberToRemove(member.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {team.location && (
              <div>
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-sm text-muted-foreground">{team.location.address}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Creado el {new Date(team.createdAt).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Expulsar miembro</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres expulsar a este miembro del equipo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
              className="bg-destructive text-destructive-foreground"
            >
              Expulsar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Team Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar equipo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el equipo "{team.name}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

