import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Books from './pages/Books';
import Collection from './pages/Collection';
import Users from './pages/Users';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { UserProvider } from './contexts/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import { UserRole } from './constants/roles';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup', '/notfound', '/unauthorized'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <UserProvider>
      {!shouldHideNavbar && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole={UserRole.ADMIN}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
