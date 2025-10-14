import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { theme } from '../../lib/theme';
import SidebarContent from '../../components/SidebarContent';
import { useAuth } from '../../lib/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading or redirect if not authenticated
  if (loading || !isAuthenticated()) {
    return null; // or a loading screen
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.navy },
        headerTintColor: theme.colors.navyTextOn,
        drawerType: 'front',
        drawerStyle: { width: 280 },
        sceneStyle: { backgroundColor: theme.colors.background },
         headerShown:false
      }}
      drawerContent={() => <SidebarContent />}
    />
  );
}
