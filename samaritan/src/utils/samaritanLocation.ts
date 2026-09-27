import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateSamaritanLocation } from './api';
import { getItem } from './store';

const SAMARITAN_LOCATION_TASK = 'samaritan-background-location';
const LOCATION_FRESHNESS_MS = 5 * 60 * 1000;

let foregroundSubscription: Location.LocationSubscription | null = null;
let isStarting = false;

TaskManager.defineTask(SAMARITAN_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('[samaritanLocation] Background location task failed:', error.message);
    return;
  }

  const locations = (data as { locations?: Location.LocationObject[] } | undefined)?.locations;
  const latestLocation = locations?.[locations.length - 1];
  if (latestLocation) await reportLocation(latestLocation);
});

export async function startSamaritanLocationTracking(): Promise<void> {
  if (isStarting) return;
  isStarting = true;

  try {
    const [userIdValue, isSamaritanValue, foregroundPermission] = await Promise.all([
      getItem('user_id'),
      getItem('is_samaritan'),
      Location.getForegroundPermissionsAsync(),
    ]);
    const userId = Number(userIdValue);
    if (isSamaritanValue !== 'true' || !Number.isSafeInteger(userId) || !foregroundPermission.granted) {
      return;
    }

    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: LOCATION_FRESHNESS_MS });
    const currentLocation = lastKnown ?? await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await reportLocation(currentLocation);

    if (!foregroundSubscription) {
      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100,
          timeInterval: 120000,
        },
        (location) => {
          void reportLocation(location).catch((error: unknown) => {
            console.warn('[samaritanLocation] Foreground location upload failed:', error);
          });
        },
      );
    }

    const backgroundPermission = await Location.getBackgroundPermissionsAsync();
    if (backgroundPermission.granted
        && await TaskManager.isAvailableAsync()
        && !(await Location.hasStartedLocationUpdatesAsync(SAMARITAN_LOCATION_TASK))) {
      await Location.startLocationUpdatesAsync(SAMARITAN_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100,
        timeInterval: 120000,
        deferredUpdatesDistance: 100,
        deferredUpdatesInterval: 120000,
        foregroundService: {
          notificationTitle: 'Samaritan is available',
          notificationBody: 'Sharing your location while you are opted in to help nearby.',
        },
      });
    }
  } catch (error) {
    console.warn('[samaritanLocation] Could not start location tracking:', error);
  } finally {
    isStarting = false;
  }
}

async function reportLocation(location: Location.LocationObject): Promise<void> {
  const userIdValue = await getItem('user_id');
  const userId = Number(userIdValue);
  if (userIdValue === null || !Number.isSafeInteger(userId)) return;
  await updateSamaritanLocation(userId, location.coords.latitude, location.coords.longitude);
}