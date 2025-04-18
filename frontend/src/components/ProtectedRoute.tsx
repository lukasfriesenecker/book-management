import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div>Lade Benutzerdaten...</div>; // oder Spinner
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
