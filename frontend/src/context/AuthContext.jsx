import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userInfo = localStorage.getItem('userInfo');
      
      console.log('Auth Check - Token exists:', !!token);
      
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
        // Verify token with backend
        const response = await API.get('/auth/profile');
        console.log('Token verified:', response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', email);
      const { data } = await API.post('/auth/login', { email, password });
      
      console.log('Login successful:', data);
      
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      // IMPROVED ERROR HANDLING
      const errorData = error.response?.data;
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (errorData?.message === 'Validation failed' && errorData?.errors) {
        errorMessage = errorData.errors.map(err => err.message).join(', ');
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

const register = async (userData) => {
  try {
    console.log('Register attempt:', userData.email);
    const { data } = await API.post('/auth/register', userData);
    
    console.log('Registration successful:', data);
    
    localStorage.setItem('userToken', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    const errorData = error.response?.data;
    let errorMessage = 'Registration failed. Please try again.';
    
    if (errorData?.message === 'Validation failed' && errorData?.errors) {
      // Show specific validation errors
      errorMessage = errorData.errors.map(err => {
        if (err.field === 'password') {
          if (err.message.includes('lowercase')) {
            return 'Password must contain at least one lowercase letter';
          }
          if (err.message.includes('uppercase')) {
            return 'Password must contain at least one uppercase letter';
          }
          if (err.message.includes('number')) {
            return 'Password must contain at least one number';
          }
          return 'Password must be at least 6 characters long and contain uppercase, lowercase letters and numbers';
        }
        return err.message;
      }).join(', ');
    } else if (errorData?.message === 'User already exists') {
      errorMessage = 'An account with this email already exists.';
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};