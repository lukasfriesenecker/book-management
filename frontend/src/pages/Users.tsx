'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface User {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
}

export default function UserList() {
  const userId = 1;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [preCredentials, setPreCredentials] = useState({
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
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar initials from username
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on user id
  const getAvatarColor = (id: number) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    return colors[id % colors.length];
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Open dialog for adding a new user
  function openAddDialog() {
    setIsEditMode(false);
    setIsDialogOpen(true);
  }

  // Open dialog for editing an existing user
  function openEditDialog(user: User) {
    setPreCredentials({
      id: user.id,
      username: user.username,
      password: '',
      confirmPassword: '',
      role: user.role,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  }

  // Delete user
  const deleteUser = async (id: number) => {
    // Don't allow deleting yourself
    if (id === userId) {
      toast.error('You cannot delete your own account');
      return;
    }

    try {
      // Delete the user
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
        <header className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-2xl font-bold">Users</h1>

          <div className="flex w-full gap-2 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={openAddDialog}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            {error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {error}
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
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-8">
                          <Avatar>
                            <AvatarImage
                              src={/*user.avatarUrl ||*/ '/placeholder.svg'}
                              alt={user.username}
                            />
                            <AvatarFallback className={getAvatarColor(user.id)}>
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="pr-8 text-right">
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
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
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

      <UserDialog
        isEditMode={isEditMode}
        loading={loading}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        preCredentials={preCredentials}
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
