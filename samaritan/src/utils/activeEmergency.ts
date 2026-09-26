import * as SecureStore from 'expo-secure-store';

const ACTIVE_EMERGENCY_ID_KEY = 'samaritan_active_emergency_id';

export async function getActiveEmergencyId(): Promise<number | null> {
  const value = await SecureStore.getItemAsync(ACTIVE_EMERGENCY_ID_KEY);
  return value !== null ? Number(value) : null;
}

export async function setActiveEmergencyId(emergencyId: number): Promise<void> {
  await SecureStore.setItemAsync(ACTIVE_EMERGENCY_ID_KEY, String(emergencyId));
}

export async function clearActiveEmergencyId(): Promise<void> {
  await SecureStore.deleteItemAsync(ACTIVE_EMERGENCY_ID_KEY);
}
