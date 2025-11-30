import { NextRequest, NextResponse } from "next/server"
import { readTeams, writeTeams } from "@/lib/data-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, userId } = body
    
    if (!code || !userId) {
      return NextResponse.json(
        { error: "Code and userId are required" },
        { status: 400 }
      )
    }
    
    const teams = await readTeams()
    const team = teams.find(t => t.code.toUpperCase() === code.toUpperCase())
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      )
    }
    
    if (team.members.includes(userId)) {
      return NextResponse.json(
        { error: "User is already a member of this team" },
        { status: 400 }
      )
    }
    
    if (team.members.length >= team.maxMembers) {
      return NextResponse.json(
        { error: "Team is full" },
        { status: 400 }
      )
    }
    
    team.members.push(userId)
    await writeTeams(teams)
    
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json(
      { error: "Error joining team" },
      { status: 500 }
    )
  }
}

