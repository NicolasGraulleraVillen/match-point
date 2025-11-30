"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/types"
import usersData from "@/data/users.json"

export function useAuth() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    const currentUserId = localStorage.getItem("currentUserId")

    if (loggedIn === "true" && currentUserId) {
      const user = usersData.find((u) => u.id === currentUserId) as User | undefined
      if (user) {
        setCurrentUser(user)
        setIsLoggedIn(true)
      } else {
        // Invalid user, clear storage
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("currentUserId")
        router.push("/")
      }
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUserId")
    setIsLoggedIn(false)
    setCurrentUser(null)
    router.push("/")
  }

  return {
    isLoggedIn,
    currentUser,
    loading,
    logout,
  }
}

