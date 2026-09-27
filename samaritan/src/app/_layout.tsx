import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, LogBox } from 'react-native';
import { updateUserPushToken } from '../utils/api';
import '../utils/notifications';
import { ensureEmergencyNotificationChannel } from '../utils/notifications';
import { startSamaritanLocationTracking } from '../utils/samaritanLocation';
import { getItem } from '../utils/store';

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  useEffect(() => {
    let disposed = false;

    const syncSamaritanServices = async () => {
      const [storedUserId, isSamaritan] = await Promise.all([
        getItem('user_id'),
        getItem('is_samaritan'),
      ]);
      if (disposed || isSamaritan !== 'true') return;

      void startSamaritanLocationTracking();
      await ensureEmergencyNotificationChannel();
      if (!(await Notifications.getPermissionsAsync()).granted) return;
      const userId = Number(storedUserId);
      if (!Number.isSafeInteger(userId)) return;
      const token = await Notifications.getDevicePushTokenAsync();
      if (!disposed && token.type === 'android') {
        await updateUserPushToken(userId, String(token.data));
      }
    };

    const notificationResponse = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/(tabs)/alerts');
    });
    const lastResponse = Notifications.getLastNotificationResponseAsync();
    void lastResponse.then((response) => {
      if (!disposed && response) router.push('/(tabs)/alerts');
    }).catch((error: unknown) => {
      console.warn('[notifications] Could not read the launch notification:', error);
    });

    const tokenSubscription = Notifications.addPushTokenListener((token) => {
      if (token.type !== 'android') return;
      void getItem('user_id').then((storedUserId) => {
        const userId = Number(storedUserId);
        if (storedUserId && Number.isSafeInteger(userId)) {
          return updateUserPushToken(userId, String(token.data));
        }
      }).catch((error: unknown) => {
        console.warn('[notifications] Could not update the rotated push token:', error);
      });
    });

    void syncSamaritanServices().catch((error: unknown) => {
      console.warn('[samaritan] Could not restore push/location services:', error);
    });
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncSamaritanServices().catch((error: unknown) => {
          console.warn('[samaritan] Could not refresh push/location services:', error);
        });
      }
    });

    return () => {
      disposed = true;
      notificationResponse.remove();
      tokenSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="emergency" options={{ headerShown: false }} />
        <Stack.Screen name="new-alert-details" options={{ headerShown: false }} />
        <Stack.Screen name="emergency-status" options={{ headerShown: false }} />
        <Stack.Screen name="alert-details" options={{ title: 'Alert details' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
