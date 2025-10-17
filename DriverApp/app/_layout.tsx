import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated/lib/reanimated2/js-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
import crashlyticsService from '@/lib/crashlytics';
import ErrorHandler from '@/lib/errorHandler';
import { theme } from "../lib/theme";
import { AuthProvider } from "../lib/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Initialize error handling and crashlytics
  useEffect(() => {
    ErrorHandler.initialize();
    crashlyticsService.log('DriverApp started');
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.navy },
          headerTintColor: theme.colors.navyTextOn,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown:false
        }}
      />
    </AuthProvider>
  );
}
