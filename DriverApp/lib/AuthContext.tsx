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

  const API_BASE_URL = 'http://10.65.103.156:2000';

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
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token && response.data.driver) {
        const { token: newToken, driver: driverData } = response.data;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('driver_token', newToken);
        await AsyncStorage.setItem('driver_data', JSON.stringify(driverData));
        
        // Update state
        setToken(newToken);
        setDriver(driverData);
        
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
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
