import { CreateEmergency, EmergencyBackendResponse } from '../constants/apiObjects';

// Set EXPO_PUBLIC_API_BASE_URL in .env. When testing on a physical device/simulator,
// "localhost" points at the device itself, so use your computer's LAN IP instead
// (e.g. http://192.168.1.23:3000). Use https:// once pointed at a real backend.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

/**
 * Sends a POST /emergency request to the backend to create a new emergency.
 */
export async function createEmergency(payload: CreateEmergency): Promise<EmergencyBackendResponse> {
  console.log('[createEmergency] Step A: Request payload ->', payload);

  const response = await fetch(`${API_BASE_URL}/emergency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('[createEmergency] Step B: Response status ->', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('[createEmergency] Step C: Error response body ->', errorText);
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: EmergencyBackendResponse = await response.json();
  console.log('[createEmergency] Step C: Success response body ->', data);

  return data;
}
