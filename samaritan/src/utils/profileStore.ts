import * as SecureStore from 'expo-secure-store';
import { CreateUser } from '../constants/apiObjects';

const PROFILE_KEY = 'samaritan_profile';

// Locally stored mirror of whatever was last sent to POST /user, so the Profile screen has something to read.
export async function getStoredProfile(): Promise<CreateUser | null> {
  const value = await SecureStore.getItemAsync(PROFILE_KEY);
  return value !== null ? JSON.parse(value) : null;
}

export async function setStoredProfile(profile: CreateUser): Promise<void> {
  await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
}
