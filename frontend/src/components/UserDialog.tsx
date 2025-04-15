import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DialogInput from '@/components/DialogInput';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api';
import { UserRole } from '@/constants/roles';

interface Credentials {
  id: number;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface UserDialogProps {
  isEditMode: boolean;
  loading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  preCredentials: Credentials;
  onSave: (user: Credentials) => void;
}

export default function UserDialog({
  isEditMode,
  loading,
  isDialogOpen,
  setIsDialogOpen,
  preCredentials,
  onSave,
}: UserDialogProps) {
  const [formData, setFormData] = useState<Credentials>(preCredentials);

  useEffect(() => {
    setFormData(preCredentials);
  }, [preCredentials]);

  const handleInputChange =
    (field: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const addOrUpdateUser = async () => {
    if (!formData.username || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditMode && (!formData.password || !formData.confirmPassword)) {
      toast.error('Please provide a password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/users/${preCredentials?.id}`, {
          password: formData.password,
          role: formData.role,
        });
        toast.success('User updated successfully');
      } else {
        response = await api.post('/users', formData);
        toast.success('User added successfully');
      }

      onSave(response.data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(
        isEditMode
          ? 'Failed to update user. Please try again.'
          : 'Failed to add user. Please try again.',
      );
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the user details.'
              : 'Enter the details of the new user.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DialogInput
            label="Username"
            icon={<User />}
            type="username"
            identifier="username"
            value={formData.username}
            onChange={handleInputChange('username')}
            disabled={loading}
          />

          <DialogInput
            label="Password"
            icon={<Lock />}
            type="password"
            identifier="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            disabled={loading}
          />

          <DialogInput
            label="Confirm Password"
            icon={<Lock />}
            type="password"
            identifier="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            disabled={loading}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value as UserRole }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={addOrUpdateUser}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditMode ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
