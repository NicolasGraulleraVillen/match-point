import { Trophy } from "lucide-react"
import { IoFootball } from "react-icons/io5"
import { IoBasketball } from "react-icons/io5"
import { GiTennisBall, GiPaddles } from "react-icons/gi"

export type SportType = "Fútbol" | "Baloncesto" | "Tenis" | "Pádel"

export const SportIcon = ({ 
  sport, 
  className = "h-6 w-6" 
}: { 
  sport: SportType | string
  className?: string 
}) => {
  const sportKey = sport.toLowerCase()
  
  if (sportKey.includes("fútbol") || sportKey.includes("football")) {
    return <IoFootball className={className} />
  }
  
  if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) {
    return <IoBasketball className={className} />
  }
  
  if (sportKey.includes("tenis") || sportKey.includes("tennis")) {
    return <GiTennisBall className={className} />
  }
  
  if (sportKey.includes("pádel") || sportKey.includes("padel")) {
    return <GiPaddles className={className} />
  }
  
  return <Trophy className={className} />
}

export const getSportName = (sport: string): string => {
  const sportKey = sport.toLowerCase()
  if (sportKey.includes("fútbol") || sportKey.includes("football")) return "Fútbol"
  if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) return "Baloncesto"
  if (sportKey.includes("tenis") || sportKey.includes("tennis")) return "Tenis"
  if (sportKey.includes("pádel") || sportKey.includes("padel")) return "Pádel"
  return sport
}

export const getSportColor = (sport: string): string => {
  const sportKey = sport.toLowerCase()
  if (sportKey.includes("fútbol") || sportKey.includes("football")) return "text-green-600"
  if (sportKey.includes("baloncesto") || sportKey.includes("basketball")) return "text-orange-600"
  if (sportKey.includes("tenis") || sportKey.includes("tennis")) return "text-blue-600"
  if (sportKey.includes("pádel") || sportKey.includes("padel")) return "text-yellow-600"
  return "text-primary"
}

