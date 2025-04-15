import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn('bitte');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
