import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; 
import { useUser } from '../hooks/useApiData';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
    const { data: users = {} , isLoading } = useUser();

    console.log(users)
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && users) {
      setUser(users);
    } 
  }, [users]);



  const register = async (formData) => {
    try {
      setError('');
      const res = await api.post('/auth/register', formData);
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log(error);
      let message = 'Registration failed';

      if (error?.response?.data?.errors) {
        message = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (formData) => {
    try {
      setError('');
      const res = await api.post('/auth/login', formData);
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log(error);
      let message = 'Login failed';

      if (error?.response?.data?.errors) {
        message = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      setError(message);
      return { success: false, error: message };
    }
  };
              
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading: isLoading,
    error,
    register,
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};