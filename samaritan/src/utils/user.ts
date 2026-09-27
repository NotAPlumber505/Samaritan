import * as Location from 'expo-location';
import { postUser } from "./api";
import { generateECDSAKeyPair } from "./ecdsa";
import { getSamaritanDevicePushToken } from './notifications';
import { startSamaritanLocationTracking } from './samaritanLocation';
import { setItem, setSecureItem } from "./store";


export const createUser = async (is_samaritan: boolean) => {
    const keyPair = generateECDSAKeyPair()
    if(!keyPair) {
        throw new Error("Key pair came back null when generating user!")
    }
    if(!keyPair[0]) {
        throw new Error("Private key came back null!");
    }
    if(!keyPair[1]) {
        throw new Error("Public key came back null!");
    }
    await setSecureItem("ecdsaPrivateKey",String(keyPair[0]))
    const pushToken = is_samaritan ? await getSamaritanDevicePushToken() : undefined;
    let initialLocation: Location.LocationObject | null = null;
    if (is_samaritan && (await Location.getForegroundPermissionsAsync()).granted) {
        try {
            initialLocation = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 })
                ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch (error) {
            console.warn('[createUser] Could not get initial Samaritan location:', error);
        }
    }
    const response = await postUser(
        {
            ecdsa_public_key: String(keyPair[1]),
            is_samaritan,
            push_token: pushToken,
            latitude: initialLocation?.coords.latitude,
            longitude: initialLocation?.coords.longitude,
        }
    )
    await setItem("is_samaritan",String(is_samaritan))
    await setItem("user_id",String(response.user_id))
    if (is_samaritan) await startSamaritanLocationTracking();

    
}