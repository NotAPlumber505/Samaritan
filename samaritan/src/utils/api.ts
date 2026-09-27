import {
    AcceptEmergency,
    CreateEmergency,
    CreateUser,
    CreateUserResponse,
    DeleteEmergency,
    DistanceToResponder,
    Emergencies,
    EmergencyBackendResponse,
    ReportLocation,
    RequestEmergencies,
    UpdateEmergency,
} from '../constants/apiObjects';
import { signData } from './ecdsa';
import { getSecureItem } from './store';

// Set EXPO_PUBLIC_API_BASE_URL in .env. When testing on a physical device/simulator,
// "localhost" points at the device itself, so use your computer's LAN IP instead
// (e.g. http://192.168.1.23:3000). Use https:// once pointed at a real backend.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Shared fetch helper: sends the request, logs each step, and throws on a non-OK response.
 * Every API wrapper below is a thin, typed call to this so the debug logging stays consistent.
 */
async function apiRequest<T>(label: string, method: string, path: string, body?: unknown): Promise<T> {
  console.log(`[${label}] Step A: Request -> ${method} ${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  console.log(`[${label}] Step B: Response status ->`, response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`[${label}] Step C: Error response body ->`, errorText);
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    console.log(`[${label}] Step C: Success (no content)`);
    return undefined as T;
  }

  const data = (await response.json()) as T;
  console.log(`[${label}] Step C: Success response body ->`, data);
  return data;
}

/**
 * Sends a POST /user request to the backend to create a new user.
 */
export function postUser(payload: CreateUser): Promise<CreateUserResponse> {
  return apiRequest<CreateUserResponse>('createUser', 'POST', '/user', payload);
}

export async function updateSamaritanLocation(
  userId: number,
  latitude: number,
  longitude: number,
): Promise<void> {
  const unsignedPayload = { user_id: userId, latitude, longitude };
  const signature = signData(
    getSecureItem('ecdsaPrivateKey') ?? '',
    JSON.stringify(unsignedPayload),
  );
  if (!signature) throw new Error('Could not sign the Samaritan location update.');

  await apiRequest<void>(
    'updateSamaritanLocation',
    'PUT',
    `/user/${userId}/location`,
    { ...unsignedPayload, ecdsa_signature: signature },
  );
}

export async function updateUserPushToken(userId: number, pushToken: string): Promise<void> {
  const unsignedPayload = { user_id: userId, push_token: pushToken };
  const signature = signData(
    getSecureItem('ecdsaPrivateKey') ?? '',
    JSON.stringify(unsignedPayload),
  );
  if (!signature) throw new Error('Could not sign the push-token update.');
  await apiRequest<void>('updatePushToken', 'PUT', `/user/${userId}/push-token`, {
    ...unsignedPayload,
    ecdsa_signature: signature,
  });
}

/**
 * Sends a POST /emergency request to the backend to create a new emergency.
 */
export function createEmergency(payload: CreateEmergency): Promise<EmergencyBackendResponse> {
  return apiRequest<EmergencyBackendResponse>('createEmergency', 'POST', '/emergency', payload);
}

/**
 * Sends a POST /emergency/update request to the backend to update an existing emergency.
 */
export function updateEmergency(
  payload: Omit<UpdateEmergency, 'ecdsa_signature'>,
): Promise<EmergencyBackendResponse> {
  const unsignedPayload = {
    user_id: Number(payload.user_id),
    emergency_id: Number(payload.emergency_id),
    ...(payload.latitude !== undefined && { latitude: Number(payload.latitude) }),
    ...(payload.longitude !== undefined && { longitude: Number(payload.longitude) }),
    ...(payload.requires_911 !== undefined && { requires_911: payload.requires_911 }),
    ...(payload.emergency_nature !== undefined && { emergency_nature: payload.emergency_nature }),
    ...(payload.self_emergency !== undefined && { self_emergency: payload.self_emergency }),
    ...(payload.description !== undefined && { description: payload.description }),
  };
  const signature = signData(
    getSecureItem('ecdsaPrivateKey') ?? '',
    JSON.stringify(unsignedPayload),
  );
  if (!signature) return Promise.reject(new Error('Could not sign the emergency update.'));

  return apiRequest<EmergencyBackendResponse>('updateEmergency', 'POST', '/emergency/update', {
    ...unsignedPayload,
    ecdsa_signature: signature,
  });
}

/**
 * Sends a GET /emergency request to the backend for emergencies near the given coordinates.
 */
export function getEmergencies(payload: RequestEmergencies): Promise<Emergencies> {
  const query = new URLSearchParams({
    Latitude: String(payload.latitude),
    Longitude: String(payload.longitude),
  });
  return apiRequest<Emergencies>('getEmergencies', 'GET', `/emergency?${query.toString()}`);
}

/**
 * Sends a POST /emergency/{id}/accept request to the backend to accept an emergency.
 */
export function acceptEmergency(payload: AcceptEmergency): Promise<EmergencyBackendResponse> {
  return apiRequest<EmergencyBackendResponse>(
    'acceptEmergency',
    'POST',
    `/emergency/${payload.emergency_id}/accept`,
    payload,
  );
}

/**
 * Sends a DELETE /emergency/{id} request to the backend to delete an emergency.
 */
export function deleteEmergency(emergencyId: number, payload: DeleteEmergency): Promise<void> {
  return apiRequest<void>('deleteEmergency', 'DELETE', `/emergency/${emergencyId}`, payload);
}

/**
 * Sends a POST /location/{emergencyId}/{label} request to report where the requester or responder currently is.
 */
export function reportLocation(
  emergencyId: number,
  label: 'requester' | 'responder',
  payload: ReportLocation,
): Promise<void> {
  return apiRequest<void>('reportLocation', 'POST', `/location/${emergencyId}/${label}`, payload);
}

/**
 * Sends a GET /location/{emergencyId}/distance request for how far the responder is from the requester.
 */
export function getDistanceToResponder(emergencyId: number): Promise<DistanceToResponder> {
  return apiRequest<DistanceToResponder>('getDistanceToResponder', 'GET', `/location/${emergencyId}/distance`);
}
