/**
 * Auth Context — manages user authentication state globally
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if tokens exist
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await authService.getProfile();
          setUser(data.user);
        } catch {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
