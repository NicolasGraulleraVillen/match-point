"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Toast } from "@/components/ui/toast"
import { joinTeam } from "@/lib/api-client"

export default function JoinTeamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn, loading, currentUser } = useAuth()
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    const codeParam = searchParams.get("code")
    if (codeParam) {
      setCode(codeParam.toUpperCase())
    }
  }, [searchParams])

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
      const team = await joinTeam(code.toUpperCase(), currentUser.id)
      setToast({ message: `Te has unido a ${team.name} exitosamente`, type: "success" })
      setTimeout(() => {
        router.push(`/teams/${team.id}`)
      }, 1500)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Error al unirse al equipo",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="flex-1 p-4 md:container md:mx-auto md:max-w-2xl md:py-8">
        <h1 className="mb-6 text-3xl font-bold">Unirse a un Equipo</h1>

        <Card>
          <CardHeader>
            <CardTitle>Ingresa el código del equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código del Equipo</Label>
                <Input
                  id="code"
                  placeholder="Ej: TIGRES"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                  className="text-center text-2xl font-bold tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Pide el código al creador del equipo
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Uniéndose..." : "Unirse al Equipo"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/teams/create")}
          >
            ¿Quieres crear un equipo?
          </Button>
        </div>
      </div>

      <MobileBottomNav />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

