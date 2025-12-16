import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../constants';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.refreshToken();
        if (response.success) {
          const userResponse = await api.getMe();
          if (userResponse.success && userResponse.data) {
            setUser({
              id: userResponse.data.id,
              email: userResponse.data.email,
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
              role: userResponse.data.role,
            });
          }
        }
      } catch (error) {
        console.log('No active session');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await api.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        setUser(null);
        api.setAccessToken(null);
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
        });
        return true;
      }
      setError('Email ou mot de passe invalide');
      return false;
    } catch (error) {
      const errorMsg = error?.message || 'Erreur de connexion';
      setError(errorMsg);
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      api.setAccessToken(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    const handle401 = () => {
      setUser(null);
      api.setAccessToken(null);
      setError('Session expirée. Veuillez vous reconnecter.');
    };

    window.addEventListener('unauthorized', handle401);
    return () => window.removeEventListener('unauthorized', handle401);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
