"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Save } from "lucide-react"
import { updateUser } from "@/lib/api-client"
import { User } from "@/types"
import { Toast } from "@/components/ui/toast"

interface SportProfileCardProps {
  sport: string
  user: User
  onUpdate: () => void
}

export function SportProfileCard({ sport, user, onUpdate }: SportProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(
    user.sportProfiles?.[sport]?.avatar || user.avatar
  )
  const [bio, setBio] = useState(user.sportProfiles?.[sport]?.bio || "")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ message: "Por favor selecciona una imagen", type: "error" })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "La imagen debe ser menor a 5MB", type: "error" })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user.id)
      formData.append("type", "sport-avatar")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir la imagen")
      }

      const data = await response.json()
      setAvatarUrl(data.url)
      setToast({ message: "Avatar actualizado", type: "success" })
    } catch (error) {
      setToast({ message: "Error al subir la imagen", type: "error" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const sportProfiles = {
        ...user.sportProfiles,
        [sport]: {
          ...user.sportProfiles?.[sport],
          avatar: avatarUrl,
          bio: bio,
        },
      }

      await updateUser(user.id, { sportProfiles })
      setToast({ message: "Perfil de deporte actualizado", type: "success" })
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      setToast({ message: "Error al guardar", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  const stats = user.sportProfiles?.[sport]?.stats || {
    wins: 0,
    losses: 0,
    matches: 0,
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{sport}</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={`${sport} avatar`} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90"
                  disabled={isUploading}
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Biografía</Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe tu experiencia en este deporte..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{user.name}</p>
                  {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.wins || 0}</p>
              <p className="text-xs text-muted-foreground">Victorias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.losses || 0}</p>
              <p className="text-xs text-muted-foreground">Derrotas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.matches || 0}</p>
              <p className="text-xs text-muted-foreground">Partidos</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditing(false)
                  setAvatarUrl(user.sportProfiles?.[sport]?.avatar || user.avatar)
                  setBio(user.sportProfiles?.[sport]?.bio || "")
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving || isUploading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

