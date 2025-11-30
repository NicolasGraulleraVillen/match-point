"use client"

import { Match, User, Team } from "@/types"

const API_BASE = "/api"

export async function createMatch(matchData: Partial<Match>): Promise<Match> {
  const response = await fetch(`${API_BASE}/matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(matchData),
  })

  if (!response.ok) {
    throw new Error("Error creating match")
  }

  return response.json()
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
  const response = await fetch(`${API_BASE}/matches`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    throw new Error("Error updating match")
  }

  return response.json()
}

export async function deleteMatch(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/matches?id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Error deleting match")
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`)
  
  if (!response.ok) {
    throw new Error("Error fetching users")
  }
  
  return response.json()
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    throw new Error("Error updating user")
  }

  return response.json()
}

export async function changePassword(id: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password: newPassword }),
  })

  if (!response.ok) {
    throw new Error("Error changing password")
  }
}

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE}/teams`)
  if (!response.ok) {
    throw new Error("Error fetching teams")
  }
  return response.json()
}

export async function createTeam(teamData: Partial<Team>): Promise<Team> {
  const response = await fetch(`${API_BASE}/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teamData),
  })

  if (!response.ok) {
    throw new Error("Error creating team")
  }

  return response.json()
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  const response = await fetch(`${API_BASE}/teams`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    throw new Error("Error updating team")
  }

  return response.json()
}

export async function deleteTeam(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/teams?id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Error deleting team")
  }
}

export async function joinTeam(code: string, userId: string): Promise<Team> {
  const response = await fetch(`${API_BASE}/teams/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, userId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error joining team")
  }

  return response.json()
}

