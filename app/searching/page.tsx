"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function SearchingPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate searching, then redirect to home
    const timer = setTimeout(() => {
      router.push("/home")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-48 w-48">
            <div className="absolute inset-0 animate-pulse-search rounded-full bg-primary opacity-20"></div>
            <div className="absolute inset-4 animate-pulse-search rounded-full bg-primary opacity-40"></div>
            <div className="absolute inset-8 animate-pulse-search rounded-full bg-primary opacity-60"></div>
            <div className="absolute inset-12 flex items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">
                🎾
              </span>
            </div>
          </div>
          <p className="text-xl font-semibold">Buscando....</p>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  )
}

