import { Routes, Route } from 'react-router-dom';
import Books from './pages/Books';
import Collection from './pages/Collection';
import Users from './pages/Users';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/books" element={<Books />} />
        <Route path="/collection/:userId" element={<Collection />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </UserProvider>
  );
}

export default App;
