import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

// Configure how notifications behave when the app is in the foreground.
// This only needs to run once, so it lives at module level, not inside the hook.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // replaces the deprecated shouldShowAlert
    shouldShowList: true,
  }),
});

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

async function registerForPushNotificationsAsync(): Promise<
  Notifications.ExpoPushToken | undefined
> {
  // Android 13+ needs a channel to exist before the permission prompt will show
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device.");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    console.error("EAS projectId not found in app config.");
    return;
  }

  try {
    return await Notifications.getExpoPushTokenAsync({ projectId });
  } catch (error) {
    console.error("Error getting push token:", error);
    return;
  }
}

export const usePushNotifications = (): PushNotificationState => {
  // stores the device's Expo push token
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  // keeps track of the latest notification received
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  // subscriptions to notification events
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // prevents duplicate navigations when a notification is tapped
  const isNavigatingRef = useRef(false);

  const router = useRouter();

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      if (isNavigatingRef.current) return;

      const data = response.notification.request.content.data as
        | { screen?: string; params?: Record<string, string> }
        | undefined;

      if (!data?.screen) return;

      isNavigatingRef.current = true;

      try {
        router.push({
          pathname: data.screen as any, // cast needed if typed routes are enabled
          params: { ...(data.params ?? {}) },
        });
      } catch (error) {
        console.error("Error handling notification tap:", error);
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }
    },
    [router]
  );

  useEffect(() => {
    let isMounted = true;

    registerForPushNotificationsAsync().then((token) => {
      if (isMounted) setExpoPushToken(token);
    });

    // Fired when a notification arrives while the app is open
    notificationListener.current =
      Notifications.addNotificationReceivedListener((n) => {
        setNotification(n);
      });

    // Fired when the user taps a notification (app in foreground or background)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    // Handle the case where a tap launched the app from a killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (isMounted && response) handleNotificationResponse(response);
    });

    return () => {
      isMounted = false;
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [handleNotificationResponse]);

  return { expoPushToken, notification };
};
