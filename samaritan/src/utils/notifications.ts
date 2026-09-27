import * as Notifications from 'expo-notifications';


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
        if((await Notifications.requestPermissionsAsync()).granted)
            return true
        return false
    }
    catch(e) {
        console.log("Failed to request for notification permissions!")
        return false
    }
}