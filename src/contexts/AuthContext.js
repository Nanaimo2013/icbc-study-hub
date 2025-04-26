import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Save token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // Login user
  const login = async (username, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // Save token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Update user progress
  const updateProgress = async (progress) => {
    if (!currentUser) return null;
    
    try {
      const response = await axios.post('/api/progress', { progress });
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  };

  // Get user data
  const getUserData = async () => {
    if (!currentUser) return null;
    
    try {
      const response = await axios.get('/api/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProgress,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 