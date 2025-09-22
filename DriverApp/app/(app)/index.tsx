import { Redirect } from 'expo-router';

export default function AppIndex() {
  // When entering the (app) group, go to the root Dashboard alias
  return <Redirect href="/home" />;
}
