import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to refresh token on app load (using HttpOnly cookie)
    const checkAuth = async () => {
      try {
        const response = await api.refreshToken();
        if (response.success) {
          const userResponse = await api.getMe();
          if (userResponse.success && userResponse.data) {
            setUser({
              id: userResponse.data._id,
              email: userResponse.data.email,
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
              role: userResponse.data.role as UserRole,
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

  // Separate effect for auto-refresh interval
  useEffect(() => {
    if (!user) return;

    // Auto-refresh token every 14 minutes (before 15min expiry)
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser({
          id: userData._id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role as UserRole,
        });
        return true;
      }
      setError('Email ou mot de passe invalide');
      return false;
    } catch (error: any) {
      // Extract error message from backend (Error object has message property)
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

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const clearError = () => setError(null);

  // Global 401 handler - logout on unauthorized
  useEffect(() => {
    const handle401 = () => {
      setUser(null);
      api.setAccessToken(null);
      setError('Session expirée. Veuillez vous reconnecter.');
    };

    // Listen for 401 errors from API
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
