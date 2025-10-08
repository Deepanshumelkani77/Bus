import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = 'http://localhost:2000';

  // Check if admin is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    return !!(token && adminData);
  };

  // Clear error function
  const clearError = () => {
    setError('');
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      // For now, we'll use a simple admin check
      // In production, you'd want a separate admin authentication endpoint
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.token) {
        // Store admin token and data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.driver));
        setAdmin(response.data.driver);
        
        // Navigate to dashboard
        navigate('/dashboard');
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    navigate('/login');
  };

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    
    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        logout();
      }
    }
  }, []);

  // Redirect logic
  useEffect(() => {
    const isAuth = isAuthenticated();
    const isLoginPage = location.pathname === '/login';
    
    if (!isAuth && !isLoginPage) {
      navigate('/login');
    } else if (isAuth && isLoginPage) {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

  const value = {
    loading,
    error,
    admin,
    login,
    logout,
    isAuthenticated,
    clearError
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
