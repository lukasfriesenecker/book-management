import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, login } from '../utils/auth';

interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
}>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data: React.SetStateAction<User | null>) => {
        if (!data) {
          login();
        } else {
          setUser(data);
        }
      })
      .catch(() => login())
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
