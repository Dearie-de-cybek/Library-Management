import React, { createContext, useContext, useReducer, useEffect } from 'react';
import LibraryService from '../services/dataService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false,
        user: null,
        token: null 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      };
    case 'LOAD_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        loading: false 
      };
    case 'LOAD_USER_FAILURE':
      return { 
        ...state, 
        isAuthenticated: false, 
        loading: false,
        user: null,
        token: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  loading: false, // Changed to false to allow public access immediately
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      // No token, set to not authenticated but not loading
      dispatch({ type: 'LOAD_USER_FAILURE' });
    }
  }, []);

  const loadUser = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await LibraryService.getCurrentUser();
      dispatch({ type: 'LOAD_USER', payload: user });
    } catch (error) {
      console.error('Error loading user:', error);
      // Remove invalid token and continue as guest
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOAD_USER_FAILURE' });
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await LibraryService.login(credentials);
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      
      // Store token in localStorage
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: `Invalid credientials please try again بيانات الاعتماد غير صالحة، يرجى المحاولة مرة أخرى
` });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await LibraryService.register(userData);
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      
      // Store token in localStorage
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed. Please try again. فشل التسجيل. يرجى المحاولة مرة أخرى' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Try to call logout API, but don't fail if it doesn't work
      await LibraryService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
    clearError,
    isAdmin: () => state.user?.role === 'admin'
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