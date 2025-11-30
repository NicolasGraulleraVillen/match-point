export type Level = "novato" | "intermedio" | "pro"

export interface User {
  id: string
  username: string
  email: string
  password: string
  name: string
  age: number
  university: string
  course: string
  profileCompletion: number
  points: number
  avatar: string
  coverPhoto: string
  sports: string[]
  pairSports: string[]
  mainSport?: string
  levels?: Record<string, Level>
  sportProfiles?: {
    [sport: string]: {
      avatar?: string
      bio?: string
      stats?: {
        wins?: number
        losses?: number
        matches?: number
        winRate?: number
        skillRating?: number
        stamina?: number
        technique?: number
        teamwork?: number
      }
    }
  }
}

export interface Match {
  id: string
  sport: string
  createdBy: string
  createdByName: string
  createdByUsername: string
  date: string
  time: string
  location: {
    lat: number
    lng: number
    address: string
  }
  totalPlayers: number
  currentPlayers: number
  requiresApproval: boolean
  distance: number
  status: "active" | "completed" | "cancelled"
  players: string[]
  pendingRequests: string[]
  // Team fields
  isTeamMatch?: boolean
  team1Id?: string
  team1Name?: string
  team2Id?: string
  team2Name?: string
  lookingForTeam?: boolean // If true, this team is looking for another team
}

export interface Post {
  id: string
  userId: string
  username: string
  name: string
  content: string
  image: string | null
  likes: number
  comments: number
  createdAt: string
}

export interface Team {
  id: string
  name: string
  code: string
  sport: "Fútbol" | "Baloncesto"
  createdBy: string
  createdByName: string
  createdByUsername: string
  members: string[]
  maxMembers: number
  createdAt: string
  description?: string
  location?: {
    lat: number
    lng: number
    address: string
  }
}

export interface HistoryMatch {
  id: string
  sport: string
  date: string
  opponent: string
  result: "win" | "loss" | "draw"
  score: string
  level: Level
  location?: string
  participants?: string[]
}

export interface RankingEntry {
  position: number
  userId: string
  name: string
  university: string
  sport: string
  points: number
  matchesPlayed: number
  avatar?: string
}

