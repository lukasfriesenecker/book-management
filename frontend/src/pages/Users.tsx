import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Search, Trash2, UserPlus, User } from 'lucide-react';
import { toast } from 'sonner';

import api from '../api';
import { UserRole } from '@/constants/roles';
import UserDialog from '@/components/UserDialog';
import { getAvatarColor } from '@/utils/avatar';
import { getInitials } from '@/utils/initials';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
}

export default function UserList() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: -1,
    username: '',
    password: '',
    confirmPassword: '',
    role: UserRole.USER,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users: ', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function openAddDialog() {
    setSelectedUser({
      id: -1,
      username: '',
      password: '',
      confirmPassword: '',
      role: UserRole.USER,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  }

  function openEditDialog(user: User) {
    setSelectedUser({
      id: user.id,
      username: user.username,
      password: user.password,
      confirmPassword: user.password,
      role: user.role,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  }

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);

      toast.success('User deleted successfully');

      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  return (
    <div>
      <div className="container mx-auto max-w-7xl p-4">
        <header className="mt-6 mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-2xl font-bold">Users</h1>

          <div className="flex w-full gap-2 md:w-auto">
            <div className="relative flex flex-1 items-center md:w-64">
              <Search className="text-muted-foreground absolute left-2.5 size-4" />
              <Input
                placeholder="Search users..."
                className="pl-8.5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700"
              onClick={openAddDialog}
            >
              <UserPlus className="mr-2 size-4" />
              Add User
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            {error && (
              <div className="px-4">
                <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                  {error}
                </div>
              </div>
            )}

            {loading ? (
              <div className="py-8 text-center">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] pl-8">Avatar</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[100px] pr-8 text-left">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        No users found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="pl-8">
                          <Avatar>
                            <AvatarFallback className={getAvatarColor(data.id)}>
                              {getInitials(data.username)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {data.username}
                          {data.id === user?.id && (
                            <Badge className="ml-3 bg-indigo-600">ME</Badge>
                          )}
                        </TableCell>
                        <TableCell>{data.role}</TableCell>
                        <TableCell className="pr-8 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(data)}
                              className="size-8 cursor-pointer"
                              disabled={data.id === user?.id}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(data.id)}
                              className="size-8 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                              disabled={data.id === user?.id}
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

      <UserDialog
        isEditMode={isEditMode}
        loading={loading}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedUser={selectedUser}
        onSave={(updatedUser: User) => {
          console.warn(updatedUser);
          if (isEditMode) {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user,
              ),
            );
          } else {
            setUsers((prevUsers) => [...prevUsers, updatedUser]);
          }
        }}
      />
    </div>
  );
}
