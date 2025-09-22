import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { theme } from '../../lib/theme';
import SidebarContent from '../../components/SidebarContent';

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.navy },
        headerTintColor: theme.colors.navyTextOn,
        drawerType: 'front',
        drawerStyle: { width: 280 },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
      drawerContent={() => <SidebarContent />}
    />
  );
}
