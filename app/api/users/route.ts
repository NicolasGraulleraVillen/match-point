import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers } from "@/lib/data-utils";
import { User } from "@/types";

export async function GET() {
  try {
    const users = await readUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error reading users" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const users = await readUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    await writeUsers(users);

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      id: string;
      password?: string;
    } & Partial<User>;
    const { id, password, ...otherUpdates } = body;

    const users = await readUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update specific fields
    if (password) {
      users[userIndex].password = password;
    }

    // Update other fields
    // Update other fields (sin tocar id ni password)
    const updatesWithoutSensitive: Partial<User> & { id?: string; password?: string } = {
      ...otherUpdates,
    };
    delete updatesWithoutSensitive.id;
    delete updatesWithoutSensitive.password;

    users[userIndex] = {
      ...users[userIndex],
      ...updatesWithoutSensitive,
    };

    await writeUsers(users);

    // Don't return password in response
    const userWithoutPassword = { ...users[userIndex] };
    delete (userWithoutPassword as Partial<User>).password;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
