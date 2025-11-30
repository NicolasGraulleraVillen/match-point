"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginScreen from "@/components/screens/login-screen"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (you can implement proper auth later)
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn === "true") {
      router.push("/home")
    }
  }, [router])

  return <LoginScreen />
}

