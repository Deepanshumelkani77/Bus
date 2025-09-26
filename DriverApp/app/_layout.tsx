import { Stack } from "expo-router";
import { theme } from "../lib/theme";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout() {
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
