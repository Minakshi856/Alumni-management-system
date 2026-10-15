import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('alumniconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Check initial token and fetch profile
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('alumniconnect_token');
      const savedUser = localStorage.getItem('alumniconnect_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('alumniconnect_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('alumniconnect_token', token);
        localStorage.setItem('alumniconnect_user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to connect to server';
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('alumniconnect_token', token);
        localStorage.setItem('alumniconnect_user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('alumniconnect_token');
    localStorage.removeItem('alumniconnect_user');
  };

  const updateUserProfile = (updatedProfile) => {
    if (!user) return;
    const updated = {
      ...user,
      profile: updatedProfile,
      fullName: updatedProfile.full_name || user.fullName
    };
    setUser(updated);
    localStorage.setItem('alumniconnect_user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    isAlumni: user?.role === 'alumni',
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
