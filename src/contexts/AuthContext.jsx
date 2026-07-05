import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email) => {
    const loggedUser = authService.login(email);
    if (loggedUser) {
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = (name, email, campus) => {
    const newUser = authService.register(name, email, campus);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleFavorite = (targetId, type) => {
    if (!user) return;
    const updatedFavorites = authService.toggleFavorite(user.id, targetId, type);
    setUser({
      ...user,
      favorites: updatedFavorites
    });
  };

  const isFavorite = (targetId, type) => {
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
