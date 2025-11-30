"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import usersData from "@/data/users.json"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = usersData.find(
      (u) => u.email === email && u.password === password
    )

    if (user) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("currentUserId", user.id)
      router.push("/home")
    } else {
      setError("Email o contraseña incorrectos")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            MATCH <span className="text-primary">P</span>
            <span className="text-[#22c55e]">🎾</span>
            <span className="text-primary">INT</span>
          </h1>
          <div className="mt-2 text-lg text-muted-foreground">
            Bienvenido de vuelta :)
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Link
            href="#"
            className="block text-sm text-primary hover:underline"
          >
            Recuperar contraseña
          </Link>

          <Button type="submit" className="w-full" size="lg">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="#" className="text-primary hover:underline">
            ¿Tienes un código de invitación? Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}

