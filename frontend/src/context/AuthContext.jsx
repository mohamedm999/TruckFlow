
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First try to refresh to get a fresh access token
      const refreshRes = await api.post('/auth/refresh');
      const { accessToken } = refreshRes.data.data;
      
      // Set the token for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Then fetch user details
      const userRes = await api.get('/auth/me');
      setUser(userRes.data.data);
    } catch (error) {
      // If refresh fails or /me fails, we are not logged in.
      // Clear any partial state
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken } = res.data.data;
    
    setUser(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      // Optional: Redirect to login or reload
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
