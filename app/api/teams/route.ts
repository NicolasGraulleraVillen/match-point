import { NextRequest, NextResponse } from "next/server"
import { readTeams, writeTeams } from "@/lib/data-utils"
import { Team } from "@/types"

export async function GET() {
  try {
    const teams = await readTeams()
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json(
      { error: "Error reading teams" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const teams = await readTeams()
    
    // Generate new ID
    const newId = String(Math.max(...teams.map(t => parseInt(t.id || "0"))) + 1)
    
    // Generate unique code
    const generateCode = (name: string): string => {
      const baseCode = name.toUpperCase().replace(/\s+/g, "").substring(0, 6)
      let code = baseCode
      let counter = 1
      
      while (teams.some(t => t.code === code)) {
        code = baseCode.substring(0, 5) + counter
        counter++
      }
      
      return code
    }
    
    // Include creator and any invited members
    const members = body.members && Array.isArray(body.members) 
      ? body.members 
      : [body.createdBy]
    
    // Ensure creator is included
    if (!members.includes(body.createdBy)) {
      members.unshift(body.createdBy)
    }
    
    const newTeam: Team = {
      id: newId,
      name: body.name,
      code: body.code || generateCode(body.name),
      sport: body.sport,
      createdBy: body.createdBy,
      createdByName: body.createdByName,
      createdByUsername: body.createdByUsername,
      members: members,
      maxMembers: body.maxMembers || (body.sport === "Fútbol" ? 7 : 5),
      createdAt: new Date().toISOString(),
      description: body.description || "",
    }
    
    teams.push(newTeam)
    await writeTeams(teams)
    
    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating team" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const teams = await readTeams()
    const teamIndex = teams.findIndex(t => t.id === id)
    
    if (teamIndex === -1) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }
    
    teams[teamIndex] = { ...teams[teamIndex], ...updates }
    await writeTeams(teams)
    
    return NextResponse.json(teams[teamIndex])
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating team" },
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
        { error: "Team ID is required" },
        { status: 400 }
      )
    }
    
    const teams = await readTeams()
    const filteredTeams = teams.filter(t => t.id !== id)
    
    if (teams.length === filteredTeams.length) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }
    
    await writeTeams(filteredTeams)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting team" },
      { status: 500 }
    )
  }
}

