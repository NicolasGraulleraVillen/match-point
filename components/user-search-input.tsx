"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "@/types"
import { getUsers } from "@/lib/api-client"
import { X, Search } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UserSearchInputProps {
  selectedUsers: User[]
  onUsersChange: (users: User[]) => void
  excludeUserIds?: string[]
  maxUsers?: number
}

export function UserSearchInput({ selectedUsers, onUsersChange, excludeUserIds = [], maxUsers }: UserSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allUsers.filter(
        user =>
          !excludeUserIds.includes(user.id) &&
          !selectedUsers.find(su => su.id === user.id) &&
          (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredUsers(filtered.slice(0, 5))
      setShowResults(true)
    } else {
      setFilteredUsers([])
      setShowResults(false)
    }
  }, [searchQuery, allUsers, excludeUserIds, selectedUsers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadUsers = async () => {
    try {
      const users = await getUsers()
      setAllUsers(users)
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const addUser = (user: User) => {
    if (maxUsers && selectedUsers.length >= maxUsers) {
      return // Don't add if max users reached
    }
    if (!selectedUsers.find(u => u.id === user.id)) {
      onUsersChange([...selectedUsers, user])
    }
    setSearchQuery("")
    setShowResults(false)
  }

  const removeUser = (userId: string) => {
    onUsersChange(selectedUsers.filter(u => u.id !== userId))
  }

  return (
    <div className="space-y-3" ref={searchRef}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar usuarios por nombre o username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
            className="pl-9"
          />
        </div>
        {showResults && filteredUsers.length > 0 && (
          <Card className="absolute z-50 mt-1 w-full border shadow-lg">
            <div className="max-h-60 overflow-y-auto p-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => addUser(user)}
                  className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Miembros seleccionados ({selectedUsers.length})</p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeUser(user.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

