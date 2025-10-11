import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore user from cookies if available
  const userCookie = Cookies.get("user");
  const tokenCookie = Cookies.get("token");

  const initialUser =
    userCookie && userCookie !== "undefined" ? JSON.parse(userCookie) : null;

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(tokenCookie || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Base URL for API calls
  const API_BASE_URL = "https://bustrac-backend.onrender.com";

  // Signup
  const signup = async (name, email, password, city, phone) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(`${API_BASE_URL}/user-auth/signup`, {
        name,
        email,
        password,
        city,
        phone,
      });
      
      // Auto-login after successful signup
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
        setUser(response.data.user);
        setToken(response.data.token);
        navigate("/");
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(`${API_BASE_URL}/user-auth/login`, {
        email,
        password,
      });
      
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
        setUser(response.data.user);
        setToken(response.data.token);
        navigate("/");
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.put(`${API_BASE_URL}/user-auth/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.user) {
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get Profile
  const getProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get(`${API_BASE_URL}/user-auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.user) {
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setToken(null);
    setError("");
    navigate("/");
  };

  // Clear error
  const clearError = () => {
    setError("");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Auto-logout on token expiration
  useEffect(() => {
    if (token) {
      // Set up axios interceptor for token expiration
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
          }
          return Promise.reject(error);
        }
      );

      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }
  }, [token]);

  const value = {
    // State
    user,
    token,
    loading,
    error,
    
    // Functions
    signup,
    login,
    logout,
    updateProfile,
    getProfile,
    clearError,
    isAuthenticated,
    
    // Utils
    API_BASE_URL,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
