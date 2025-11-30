import { promises as fs } from "fs"
import path from "path"
import { Match, User, Post, Team } from "@/types"

const dataDirectory = path.join(process.cwd(), "data")

export async function readMatches(): Promise<Match[]> {
  const filePath = path.join(dataDirectory, "matches.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export async function writeMatches(matches: Match[]): Promise<void> {
  const filePath = path.join(dataDirectory, "matches.json")
  await fs.writeFile(filePath, JSON.stringify(matches, null, 2), "utf8")
}

export async function readUsers(): Promise<User[]> {
  const filePath = path.join(dataDirectory, "users.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export async function writeUsers(users: User[]): Promise<void> {
  const filePath = path.join(dataDirectory, "users.json")
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8")
}

export async function readPosts(): Promise<Post[]> {
  const filePath = path.join(dataDirectory, "posts.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export async function writePosts(posts: Post[]): Promise<void> {
  const filePath = path.join(dataDirectory, "posts.json")
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf8")
}

export async function readTeams(): Promise<Team[]> {
  const filePath = path.join(dataDirectory, "teams.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export async function writeTeams(teams: Team[]): Promise<void> {
  const filePath = path.join(dataDirectory, "teams.json")
  await fs.writeFile(filePath, JSON.stringify(teams, null, 2), "utf8")
}

