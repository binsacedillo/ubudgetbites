import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string, campus: string) => void;
  logout: () => void;
  toggleFavorite: (targetId: string, type: 'meal' | 'stall') => void;
  isFavorite: (targetId: string, type: 'meal' | 'stall') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email: string): boolean => {
    const loggedUser = authService.login(email);
    if (loggedUser) {
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, campus: string) => {
    const newUser = authService.register(name, email, campus);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleFavorite = (targetId: string, type: 'meal' | 'stall') => {
    if (!user) return;
    const updatedFavorites = authService.toggleFavorite(user.id, targetId, type);
    setUser({
      ...user,
      favorites: updatedFavorites
    });
  };

  const isFavorite = (targetId: string, type: 'meal' | 'stall'): boolean => {
    if (!user || !user.favorites) return false;
    const list = type === 'meal' ? user.favorites.meals : user.favorites.stalls;
    return list ? list.includes(targetId) : false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
