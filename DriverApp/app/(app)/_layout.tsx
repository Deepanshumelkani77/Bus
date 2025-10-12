import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';
import SidebarContent from '../../components/SidebarContent';
import { useAuth } from '../../lib/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('AppLayout - Auth state:', { loading, authenticated: isAuthenticated() });
    if (!loading && !isAuthenticated()) {
      console.log('AppLayout - Redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.navy },
        headerTintColor: theme.colors.navyTextOn,
        drawerType: 'front',
        drawerStyle: { width: 280 },
        sceneStyle: { backgroundColor: theme.colors.background },
        headerShown: false
      }}
      drawerContent={() => <SidebarContent />}
    />
  );
}
