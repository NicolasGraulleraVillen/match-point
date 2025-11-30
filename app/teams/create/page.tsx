"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { createTeam } from "@/lib/api-client"
import { User } from "@/types"
import { UserSearchInput } from "@/components/user-search-input"

export default function CreateTeamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn, loading, currentUser } = useAuth()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const sportParam = searchParams.get("sport")
  const [sport, setSport] = useState<"Fútbol" | "Baloncesto">(
    (sportParam === "Fútbol" || sportParam === "Baloncesto") ? sportParam : "Fútbol"
  )
  const [description, setDescription] = useState("")
  // Fixed maxMembers based on sport: 7 for Fútbol, 5 for Baloncesto
  const maxMembers = sport === "Fútbol" ? 7 : 5
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !currentUser) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Include creator and selected users as members
      const members = [currentUser.id, ...selectedUsers.map(u => u.id)]
      
      const team = await createTeam({
        name,
        code: code.toUpperCase() || undefined,
        sport,
        createdBy: currentUser.id,
        createdByName: currentUser.name,
        createdByUsername: currentUser.username,
        description,
        maxMembers,
        members, // Include selected users automatically
      })

      toast.success("Equipo creado exitosamente")
      setTimeout(() => {
        router.push("/home")
      }, 1500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el equipo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="flex-1 p-4 md:container md:mx-auto md:max-w-2xl md:py-8">
        <h1 className="mb-6 text-3xl font-bold">Crear Equipo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Equipo</Label>
            <Input
              id="name"
              placeholder="Ej: Los Tigres"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código del Equipo (opcional)</Label>
            <Input
              id="code"
              placeholder="Ej: TIGRES (máx 6 caracteres)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().substring(0, 6))}
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Si no proporcionas un código, se generará uno automáticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport">Deporte</Label>
            <select
              id="sport"
              value={sport}
              onChange={(e) => {
                setSport(e.target.value as "Fútbol" | "Baloncesto")
                setSelectedUsers([]) // Reset selected users when sport changes
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="Fútbol">Fútbol (7 miembros)</option>
              <option value="Baloncesto">Baloncesto (5 miembros)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              El tamaño del equipo es fijo: {maxMembers} miembros para {sport}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Invitar Miembros</Label>
            <UserSearchInput
              selectedUsers={selectedUsers}
              onUsersChange={setSelectedUsers}
              excludeUserIds={[currentUser.id]}
              maxUsers={maxMembers - 1}
            />
            <p className="text-xs text-muted-foreground">
              Puedes invitar hasta {maxMembers - 1} miembros más (incluyéndote a ti, el equipo tendrá {maxMembers} miembros)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <textarea
              id="description"
              placeholder="Describe tu equipo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Equipo"}
          </Button>
        </form>
      </div>

      <MobileBottomNav />
    </div>
  )
}

