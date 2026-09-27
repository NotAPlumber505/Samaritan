import * as Notifications from 'expo-notifications';

export const EMERGENCY_NOTIFICATION_CHANNEL = 'emergency-alerts';

export async function ensureEmergencyNotificationChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(EMERGENCY_NOTIFICATION_CHANNEL, {
    name: 'Emergency alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Forces a visual banner to drop from the top
    shouldShowList: true,   // Adds it to the notification bar/tray
    shouldPlaySound: true, // Plays alert sounds
    shouldSetBadge: false, // Disables app icon counter badges
  }),
});

export const requestNotificationsPermissions = async () => {
    try {
    await ensureEmergencyNotificationChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
    }
  catch (error) {
    console.warn('[notifications] Failed to request permission:', error);
    return false;
    }
}

export const getSamaritanDevicePushToken = async (): Promise<string | undefined> => {
    try {
      if (!(await requestNotificationsPermissions())) return undefined;
      const token = await Notifications.getDevicePushTokenAsync();
      if (token.type !== 'android') return undefined;
      return String(token.data);
    } catch (error) {
      console.warn('[notifications] Could not get an Android FCM token:', error);
      return undefined;
    }
  }