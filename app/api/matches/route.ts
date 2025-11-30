import { NextRequest, NextResponse } from "next/server"
import { readMatches, writeMatches } from "@/lib/data-utils"
import { Match } from "@/types"

export async function GET() {
  try {
    const matches = await readMatches()
    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json(
      { error: "Error reading matches" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const matches = await readMatches()
    
    // Generate new ID
    const newId = String(Math.max(...matches.map(m => parseInt(m.id))) + 1)
    
    const newMatch: Match = {
      id: newId,
      sport: body.sport,
      createdBy: body.createdBy,
      createdByName: body.createdByName,
      createdByUsername: body.createdByUsername,
      date: body.date,
      time: body.time,
      location: body.location,
      totalPlayers: body.totalPlayers,
      currentPlayers: 1,
      requiresApproval: body.requiresApproval || false,
      distance: body.distance || 0,
      status: "active",
      players: [body.createdBy],
      pendingRequests: [],
      // Team fields
      isTeamMatch: body.isTeamMatch || false,
      team1Id: body.team1Id,
      team1Name: body.team1Name,
      team2Id: body.team2Id,
      team2Name: body.team2Name,
      lookingForTeam: body.lookingForTeam || false,
    }
    
    matches.push(newMatch)
    await writeMatches(matches)
    
    return NextResponse.json(newMatch, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating match" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const matches = await readMatches()
    const matchIndex = matches.findIndex(m => m.id === id)
    
    if (matchIndex === -1) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      )
    }
    
    // Update match with new data
    const updatedMatch = { ...matches[matchIndex], ...updates }
    
    // Ensure currentPlayers matches players array length
    if (updates.players) {
      updatedMatch.currentPlayers = updates.players.length
    }
    
    matches[matchIndex] = updatedMatch
    await writeMatches(matches)
    
    return NextResponse.json(matches[matchIndex])
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating match" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      )
    }
    
    const matches = await readMatches()
    const filteredMatches = matches.filter(m => m.id !== id)
    
    if (matches.length === filteredMatches.length) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      )
    }
    
    await writeMatches(filteredMatches)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting match" },
      { status: 500 }
    )
  }
}

