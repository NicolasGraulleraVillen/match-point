import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const type = formData.get("type") as string // "avatar" or "sport-avatar"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Create media directory if it doesn't exist
    const mediaDir = path.join(process.cwd(), "public", "media")
    if (!existsSync(mediaDir)) {
      await mkdir(mediaDir, { recursive: true })
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileExtension = file.name.split(".").pop()
    const fileName = `${type}-${userId}-${Date.now()}.${fileExtension}`
    const filePath = path.join(mediaDir, fileName)

    // Save file
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/media/${fileName}`

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
}

