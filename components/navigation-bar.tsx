"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, X, User, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavigationBar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path
  const isSearchingOrAhora = pathname === "/searching" || pathname === "/ahora"

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        <Link
          href="/home"
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            isActive("/home")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Inicio</span>
        </Link>

        <Link
          href="/ahora"
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            isSearchingOrAhora
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            isSearchingOrAhora ? "bg-primary" : "bg-primary/10"
          )}>
            <span className="text-2xl">🎾</span>
          </div>
        </Link>

        <Link
          href="/historial"
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            isActive("/historial")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Trophy className="h-6 w-6" />
          <span className="text-xs">Historial</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            isActive("/profile")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}

