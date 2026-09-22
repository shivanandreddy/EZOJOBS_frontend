import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [candiate, setCandiate] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCandiate = localStorage.getItem('candiate');
    if (token && savedCandiate) {
      try {
        setCandiate(JSON.parse(savedCandiate));
      } catch (e) {
        console.error('Failed to parse candiate session', e);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, newCandiate) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('candiate', JSON.stringify(newCandiate));
    setToken(newToken);
    setCandiate(newCandiate);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('candiate');
    setToken(null);
    setCandiate(null);
  };

  // Derive isAuthenticated so protected routes can use it directly
  const isAuthenticated = Boolean(token && candiate);

  return (
    <AuthContext.Provider value={{ candiate, token, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);