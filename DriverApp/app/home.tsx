import React from 'react';
import { Redirect } from 'expo-router';

export default function HomeRedirect() {
  // Always route /home into the tabbed layout's home to preserve navbar/drawer
  return <Redirect href="/(app)/(tabs)/home" />;
}
