import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token, set it in the API and fetch user data
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setCurrentUser(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile', error);
      logout();
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/sessions', { username, password });
      const { token } = response.data;
      
      // Save token to localStorage and state
      localStorage.setItem('token', token);
      setToken(token);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/users', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Call logout endpoint if authenticated
        await api.delete('/sessions');
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      // Clear token regardless of API success
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}