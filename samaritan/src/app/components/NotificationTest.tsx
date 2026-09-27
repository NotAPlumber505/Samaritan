import * as Notifications from 'expo-notifications'; // Handles permissions, scheduling, and displaying alerts
import { useState, useEffect } from 'react'; // React hooks for state and lifecycle
import { Button, StyleSheet, View, Text } from 'react-native'; // UI elements
import Constants from 'expo-constants'; // Helpful when extracting project metadata

// Configure how notifications appear when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Forces a visual banner to drop from the top
    shouldShowList: true,   // Adds it to the notification bar/tray
    shouldPlaySound: true, // Plays alert sounds
    shouldSetBadge: false, // Disables app icon counter badges
  }),
});

export default function NotificationTest() { 
  const [expoPushToken, setExpoPushToken] = useState<string>(''); // Holds the device address string

  useEffect(() => { 
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => { 
    try { 
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Notification permissions were denied!');
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId; 
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId }); 
      
      console.log("EXPOTOKEN:", tokenData.data); 
      setExpoPushToken(tokenData.data); 

      await sendTokenToBackend(tokenData.data);//**send the fetched token to the backend :P

    } catch (error) {
      console.error("Error getting push token:", error);
    }
  };

  // Helper function to talk to your backend controller that connects with it <3
  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token, 
          userId: 'samaritan-user-123' // Temporary just for testing thank you :3
        }),
      });

      const data = await response.text();
      console.log("Backend response:", data);
    } catch (e) {
      console.error("Failed to sync token with backend:", e);
    }
  };

  const triggerLocalNotification = async () => { 
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Help Help Help no one is around :<!",
        body: "A nearby Samaritan needs medical assistance. Tap to view location :3.",
        data: { emergencyId: "hackathon-test-341" },
        sound: 'default',
      },
      trigger: null, // Triggers immediately
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Test Local Notification" onPress={triggerLocalNotification} color="#d9534f" />
      {Boolean(expoPushToken) ? (
        <Text style={styles.tokenText} numberOfLines={2}>
          Token loaded! Check terminal log.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  tokenText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});