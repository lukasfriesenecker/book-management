import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button
        className="mt-6 cursor-pointer bg-indigo-600 p-6 hover:bg-indigo-700"
        onClick={() => navigate('/')}
      >
        Go Back to Home
      </Button>
    </div>
  );
}
