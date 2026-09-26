import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="emergency" options={{ headerShown: false }} />
        <Stack.Screen name="emergency-status" options={{ headerShown: false }} />
        <Stack.Screen name="alert-details" options={{ title: 'Alert details' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
