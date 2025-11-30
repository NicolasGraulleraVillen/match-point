"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, History, User } from "lucide-react"
import { cn } from "@/lib/utils"

export const MobileBottomNav = () => {
  const pathname = usePathname()
  
  const navItems = [
    { to: "/home", icon: Home, label: "Inicio" },
    { to: "/ranking", icon: Trophy, label: "Ranking" },
    { to: "/historial", icon: History, label: "Historial" },
    { to: "/profile", icon: User, label: "Perfil" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.to || (item.to === "/home" && pathname.startsWith("/home"))
          const Icon = item.icon
          
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[70px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

