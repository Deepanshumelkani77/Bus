import { Stack } from "expo-router";
import { theme } from "../lib/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.navy },
        headerTintColor: theme.colors.navyTextOn,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
