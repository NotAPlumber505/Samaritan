import * as Location from 'expo-location';

export const requestForegroundLocationPermissions = async () => {
    try {
        if((await Location.requestForegroundPermissionsAsync()).granted)
            return true
        return false
    }
    catch(e) {
        console.log("Failed to request for notification permissions!")
        return false
    }
}

export const requestBackgroundLocationPermissions = async () => {
    try {
        if((await Location.requestBackgroundPermissionsAsync()).granted)
            return true
        return false
    }
    catch(e) {
        console.log("Failed to request for notification permissions!")
        return false
    }
}