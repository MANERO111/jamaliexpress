// contexts/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Remove any existing authorization headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Try to get user data using cookies only
      const response = await axios.get('/api/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    // No token storage needed - cookies handle everything
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Helper function to clear all cookies
  const clearAllCookies = () => {
    console.log('Starting to clear cookies...'); // Debug log
    console.log('Current cookies:', document.cookie); // Debug log
    
    const cookies = document.cookie.split(";");
    
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      if (name) { // Only process non-empty names
        console.log('Clearing cookie:', name); // Debug log
        
        // Clear cookie for current domain and path - try multiple variations
        const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
        const paths = ['/', ''];
        const domains = [
          '',
          `domain=${window.location.hostname}`,
          `domain=.${window.location.hostname}`,
          `domain=localhost` // Add localhost specifically
        ];
        
        // Try all combinations
        paths.forEach(path => {
          domains.forEach(domain => {
            const pathStr = path ? `path=${path};` : '';
            const domainStr = domain ? `${domain};` : '';
            document.cookie = `${name}=;${expiry};${pathStr}${domainStr}`;
          });
        });
      }
    }
    
    console.log('Cookies after clearing:', document.cookie); // Debug log
  };

  const logout = async () => {
    console.log('Logout function called'); // Debug log
    
    try {
      // First, perform local logout immediately to update UI
      setUser(null);
      setIsAuthenticated(false);
      console.log('Local state cleared'); // Debug log

      // Get CSRF token first for Laravel Sanctum
      console.log('Getting CSRF token...'); // Debug log
      await axios.get('/sanctum/csrf-cookie');
      
      console.log('Calling logout API...'); // Debug log
      // Try to logout from server - this should clear the session cookies
      const response = await axios.post('/api/logout');
      console.log('Server logout successful:', response); // Debug log
    } catch (error) {
      console.error('Server logout failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Even if server logout fails, continue with client-side cleanup
    }
    
    // Always perform cleanup regardless of server response
    console.log('Performing client-side cleanup...'); // Debug log
    
    // Clear all cookies on client side as backup
    clearAllCookies();
    console.log('Cookies cleared'); // Debug log
    
    // Clear any cached data
    if (typeof window !== 'undefined') {
      // Clear any potential localStorage/sessionStorage (though you mentioned not using them)
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Storage cleared'); // Debug log
      } catch (e) {
        console.log('Storage clear failed:', e);
      }
    }

    console.log('Redirecting to home page...'); // Debug log
    // Small delay before redirect to ensure state updates
    setTimeout(() => {
      // Redirect to home page instead of reload to ensure clean state
      window.location.href = '/';
    }, 500); // Increased delay to see logs
  };

  // Force logout function for when we detect invalid auth
  const forceLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAllCookies();
    window.location.href = '/';
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    forceLogout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};