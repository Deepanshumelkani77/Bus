import React from 'react';
import { Tabs } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import BusLogo from '../../../components/BusLogo';
import { theme } from '../../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.navy },
        headerTintColor: theme.colors.navyTextOn,
        tabBarActiveTintColor: theme.colors.navy,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8 }}>
            <BusLogo size={28} iconSize={16} variant="lightOnDark" />
            <Text style={{ color: theme.colors.navyTextOn, fontWeight: '800' }}>BusTrac</Text>
          </View>
        ),
        headerTitle: '',
        headerRight: () => <DrawerToggleButton tintColor={theme.colors.navyTextOn} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="map" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
