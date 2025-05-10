const API_BASE = 'http://localhost:3000/api';

export const login = () => {
  window.location.href = `${API_BASE}/auth/login`;
};

export const logout = async () => {
  window.location.href = `${API_BASE}/auth/logout`;
};

export const fetchMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return await res.json();
};
