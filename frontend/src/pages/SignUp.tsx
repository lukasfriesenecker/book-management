import { useState } from 'react';
import { BookOpen, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { useUser } from '@/contexts/UserContext';
import CredentialInput from '@/components/CredentialInput';

interface Credentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function LogIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Credentials>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/users');
      const users = response.data;

      const matchedUser = users.find(
        (user: { username: string }) => user.username === formData.username,
      );

      if (matchedUser) {
        setError('Username already exists');
      } else {
        const newUser = await api.post('/users', {
          username: formData.username,
          password: formData.password,
        });

        setUser(newUser.data);

        toast.success('Account created', {
          description: 'Your account has been successfully created!',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast.error('Login failed!');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="flex h-screen items-center justify-center sm:bg-gray-50">
      <Card className="w-full rounded-none border-0 shadow-none sm:w-sm sm:rounded-xl sm:border sm:shadow">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-indigo-600 p-3">
              <BookOpen className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <CredentialInput
                label="Username"
                icon={<User />}
                type="text"
                identifier="username"
                value={formData.username}
                onChange={handleInputChange('username')}
                disabled={isLoading}
              />
              <CredentialInput
                label="Password"
                icon={<Lock />}
                type="password"
                identifier="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={isLoading}
              />
              <CredentialInput
                label="Confirm Password"
                icon={<Lock />}
                type="password"
                identifier="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                Create account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
