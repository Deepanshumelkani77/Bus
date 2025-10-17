import { Stack } from "expo-router";
import { theme } from "../lib/theme";
import { AuthProvider } from "../lib/AuthContext";
import { useEffect } from "react";
import { initializeCrashlytics, setUserId } from "../lib/crashlytics";
import "../lib/firebase";

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase Crashlytics
    initializeCrashlytics();
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
