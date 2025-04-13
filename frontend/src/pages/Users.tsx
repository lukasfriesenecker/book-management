"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Search, Trash2, UserPlus, Lock, User } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "../api"
import { Navbar } from "@/components/Navbar"

interface User {
  id: number
  username: string
  password?: string
  role: string
  avatarUrl?: string
}

export default function UserList() {
  const userId = 1
  const [users, setUsers] = useState<User[]>([ ])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: "",
    role: "USER",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users")
      if (response.status === 200) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Generate avatar initials from username
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  // Generate a consistent color based on user id
  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    return colors[id % colors.length]
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Open dialog for adding a new user
  function openAddDialog() {
    setCurrentUser({
      id: 0,
      username: "",
      role: "USER",
    })
    setPassword("")
    setConfirmPassword("")
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  // Open dialog for editing an existing user
  function openEditDialog(user: User) {
    setCurrentUser({ ...user })
    setPassword("")
    setConfirmPassword("")
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  // Delete user
  const deleteUser = async (id: number) => {
    // Don't allow deleting yourself
    if (id === userId) {
      toast.error("You cannot delete your own account")
      return
    }

    try {
      // Delete the user
      await api.delete(`/users/${id}`)

      toast.success("User deleted successfully")

      setUsers(users.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user. Please try again.")
    }
  }

  // Add or update a user
  const addOrUpdateUser = async () => {
    // Basic validation
    if (!currentUser.username || !currentUser.role) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!isEditMode && (!password || !confirmPassword)) {
      toast.error("Please provide a password")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      if (isEditMode) {
        // Update existing user
        const userData = {
          ...currentUser,
          // Only include password if it was changed
          ...(password ? { password } : {}),
        }

        const response = await api.put(`/users/${currentUser.id}`, userData)
        toast.success("User updated successfully")

        // Update the user in local state
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? response.data : user)))
      } else {
        // For new users, always include password
        const newUser = {
          ...currentUser,
          password
        }

        // Add new user
        const response = await api.post("/users", newUser)
        toast.success("User added successfully")

        // Add to local state
        setUsers([...users, response.data])
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error(isEditMode ? "Failed to update user. Please try again." : "Failed to add user. Please try again.")
    }
  }

  return (
    <div>
      <Navbar userId={userId} username="admin" />

      <div className="container mx-auto p-4 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Users</h1>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openAddDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] pl-8">Avatar</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-left w-[100px] pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No users found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-8">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.username} />
                            <AvatarFallback className={getAvatarColor(user.id)}>
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={user.id === userId}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Dialog (Add/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the user details." : "Enter the details of the new user."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <div className="col-span-3 relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  className="col-span-3 pl-10"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder={isEditMode ? "Leave blank to keep current password" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-left">
                Confirm Password
              </Label>
              <div className="col-span-3 relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  placeholder={isEditMode ? "Leave blank to keep current password" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={currentUser.role}
                onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={addOrUpdateUser} className="bg-indigo-600 hover:bg-indigo-700">
              {isEditMode ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
