import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Driver {
  _id: string;
  name: string;
  email: string;
  city: string;
  activeBus?: string;
}

interface AuthContextType {
  driver: Driver | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://bustrac-backend.onrender.com';

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('driver_token');
      const storedDriver = await AsyncStorage.getItem('driver_data');

      if (storedToken && storedDriver) {
        setToken(storedToken);
        setDriver(JSON.parse(storedDriver));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      console.log('🔄 Attempting login to:', API_BASE_URL);
      console.log('📧 Email:', email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Login response received:', response.status);

      if (response.data.token && response.data.driver) {
        const { token: newToken, driver: driverData } = response.data;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('driver_token', newToken);
        await AsyncStorage.setItem('driver_data', JSON.stringify(driverData));
        
        // Update state
        setToken(newToken);
        setDriver(driverData);
        
        console.log('✅ Login successful for driver:', driverData.name);
        return { success: true, message: 'Login successful' };
      } else {
        console.error('❌ Invalid response structure:', response.data);
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        url: `${API_BASE_URL}/auth/login`
      });
      
      let message = 'Login failed';
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        message = 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (error.code === 'ECONNABORTED') {
        message = 'Connection timeout. The server might be sleeping, please try again.';
      } else if (error.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('driver_token');
      await AsyncStorage.removeItem('driver_data');
      
      // Clear state
      setToken(null);
      setDriver(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = (): boolean => {
    return !!(driver && token);
  };

  const value: AuthContextType = {
    driver,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
