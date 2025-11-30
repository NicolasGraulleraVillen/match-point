import { NextRequest, NextResponse } from "next/server"
import { readUsers, writeUsers } from "@/lib/data-utils"
import { User } from "@/types"

export async function GET() {
  try {
    const users = await readUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: "Error reading users" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const users = await readUsers()
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates }
    await writeUsers(users)
    
    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, password, ...otherUpdates } = body
    
    const users = await readUsers()
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Update specific fields
    if (password) {
      users[userIndex].password = password
    }
    
    // Update other fields
    Object.keys(otherUpdates).forEach(key => {
      if (key !== "id" && key !== "password") {
        ;(users[userIndex] as any)[key] = otherUpdates[key]
      }
    })
    
    await writeUsers(users)
    
    // Don't return password in response
    const { password: _, ...userWithoutPassword } = users[userIndex]
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    )
  }
}

