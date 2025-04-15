import { BookOpen, Library, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { NavbarItem } from './NavbarItem';
import { useUser } from '@/contexts/UserContext';

export function Navbar() {
  const { user, logout } = useUser();

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    console.log('User logged out');
  };

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 transition-colors hover:text-indigo-600"
            >
              <BookOpen className="h-6 w-6 text-indigo-600" />
              Book Management
            </Link>
          </h1>

          <nav className="hidden items-center space-x-4 md:flex lg:space-x-6">
            <NavbarItem link={`/books`} icon={<BookOpen />} text="Books" />

            <NavbarItem
              link={`/collection/1`}
              icon={<Library />}
              text="Library"
            />
            <NavbarItem link={`/users`} icon={<Users />} text="Users" />
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-2">
              <div className="hidden flex-col text-right md:flex">
                <p className="text-sm font-bold">{user?.username}</p>
                <p className="text-xs">{user?.role}</p>
              </div>
              {
                <Avatar className="size-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
                    alt={user?.username}
                  />
                  <AvatarFallback className="bg-indigo-600 text-white">
                    {user?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
