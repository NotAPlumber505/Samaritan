import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Forces a visual banner to drop from the top
    shouldShowList: true,   // Adds it to the notification bar/tray
    shouldPlaySound: true, // Plays alert sounds
    shouldSetBadge: false, // Disables app icon counter badges
  }),
});

export const EMERGENCY_CHANNEL_ID = 'emergency-alerts';

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(EMERGENCY_CHANNEL_ID, {
    name: 'Emergency alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500, 250, 500],
    sound: 'default',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: true,
  });
}

/**
 * Requests notification permission and returns the Expo push token, or null if permission
 * was denied or the token couldn't be fetched.*/

export const requestNotificationsPermissions = async (): Promise<string | null> => {
  try {
    await ensureAndroidChannel();

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('[notifications] Permission not granted');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) {
      console.log('[notifications] Missing EAS projectId -- run `eas init` first');
      return null;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return token;
  } catch (e) {
    console.log('[notifications] Failed to request notification permissions or fetch token ->', e);
    return null;
  }
};