import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to refresh token on app load (using HttpOnly cookie)
    const checkAuth = async () => {
      try {
        // Try to refresh access token using HttpOnly cookie
        const response = await api.refreshToken();
        if (response.success) {
          // Now get user data with new token
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
        // No valid refresh token - user needs to login
        console.log('No active session');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      api.setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
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
