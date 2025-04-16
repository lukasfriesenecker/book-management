import { BookOpen, Library, Menu, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Link } from 'react-router-dom';
import { NavbarItem } from './NavbarItem';
import { useUser } from '@/contexts/UserContext';
import { BurgerItem } from './BurgerItem';
import { UserRole } from '@/constants/roles';
import { getInitials } from '@/utils/initials';
import { getAvatarColor } from '@/utils/avatar';

export function Navbar() {
  const { user, logout } = useUser();

  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <h1 className="hidden items-center gap-2 text-xl font-bold md:flex">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 transition-colors hover:text-indigo-600"
            >
              <BookOpen className="h-6 w-6" />
              Book Management
            </Link>
          </h1>

          <Menubar className="border-0 shadow-none md:hidden">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Menu />
              </MenubarTrigger>
              <MenubarContent className="w-screen md:hidden">
                <BurgerItem link={`/books`} icon={<BookOpen />} text="Books" />
                <BurgerItem
                  link={`/collection`}
                  icon={<Library />}
                  text="Library"
                />
                {user?.role === UserRole.ADMIN && (
                  <BurgerItem link={`/users`} icon={<Users />} text="Users" />
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <nav className="hidden items-center space-x-4 md:flex lg:space-x-6">
            <NavbarItem link={`/books`} icon={<BookOpen />} text="Books" />

            <NavbarItem
              link={`/collection`}
              icon={<Library />}
              text="Collection"
            />

            {user?.role === UserRole.ADMIN && (
              <NavbarItem link={`/users`} icon={<Users />} text="Users" />
            )}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-2">
              <div className="flex flex-col text-right">
                <p className="text-sm font-bold uppercase">{user?.username}</p>
                <p className="text-xs">{user?.role}</p>
              </div>
              {
                <Avatar className="size-10">
                  <AvatarFallback className={getAvatarColor(user?.id || 0)}>
                    {getInitials(user?.username || '')}
                  </AvatarFallback>
                </Avatar>
              }
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
