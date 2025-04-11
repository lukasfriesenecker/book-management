
import { BookOpen, Library, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

interface NavbarProps {
  userId: number
  username?: string
}

export function Navbar({ userId, username = "user" }: NavbarProps) {

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span>Book Management</span>
          </h1>

          <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link to={`/books`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <BookOpen className="h-4 w-4" />
                    <span>Books</span>
                </Link>
                           
                <Link to={`/collection/${userId}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <Library className="h-4 w-4" />
                    <span>Library</span>
                </Link>

                <Link to={`/users`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                </Link>
          </nav>
        </div>

       
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} alt={username} />
              <AvatarFallback className="bg-indigo-600 text-white">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
