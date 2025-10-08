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

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
    navigate('/login');
  };

  // Setup axios interceptor to include auth token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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
      
      // Use dedicated admin authentication endpoint
      const response = await axios.post(`${API_BASE}/admin-auth/login`, {
        email,
        password
      });

      if (response.data && response.data.token) {
        // Store admin token and data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setAdmin(response.data.admin);
        
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
