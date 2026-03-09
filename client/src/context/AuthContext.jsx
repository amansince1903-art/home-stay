import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Configure axios base URL ONLY for production
// In development, leave empty to use Vite proxy
if (API_BASE_URL && import.meta.env.PROD) {
  console.log('🔧 Production mode - Setting axios baseURL to:', API_BASE_URL);
  axios.defaults.baseURL = API_BASE_URL;
} else {
  console.log('🔧 Development mode - Using Vite proxy (no baseURL set)');
  console.log('   API_BASE_URL:', API_BASE_URL || '(empty)');
  console.log('   axios.defaults.baseURL:', axios.defaults.baseURL || '(not set)');
}

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
    setUser(data.data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', data.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
    setUser(data.data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
