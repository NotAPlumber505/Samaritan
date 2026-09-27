/**
 * JSON Format of requesting a user to be created
 * 
 * For POST /user
 * 
 * Served by Front-end to Back-end
 */
export interface CreateUser {
    ecdsa_public_key: String
    is_samaritan: boolean //Opt-in: true if the user agreed, on first app open, to respond to nearby emergencies
    push_token?: String //Expo push notification token, used to notify this user of nearby emergencies
    latitude?: number
    longitude?: number
    // Post-MVP: Name?: String, Allergies?: String, Bio?: String
}

/**
 * JSON Format of requesting a user to be created
 * 
 * Response from POST /user
 * 
 * Served by Back-end to Front-End
 */
export interface CreateUserResponse {
    user_id: Number
}

/**
 * JSON Format of creating an Emergency
 * 
 * For POST /emergency
 * 
 * Served by Front-end to Back-end 
*/
export interface CreateEmergency {
    user_id: Number
    latitude: Number
    longitude: Number
    ecdsa_signature: String
}

/**
 * JSON Format of updating an Emergency
 * 
 * For POST /emergency/update 
 * 
 * Served by Front-end to Back-end 
*/
export interface UpdateEmergency {
    user_id: Number
    emergency_id: Number
    latitude?: Number
    longitude?: Number
    requires_911?: boolean
    emergency_nature?: String
    self_emergency?: String
    description?: String
    ecdsa_signature: String
}

/**
 * JSON Format Response of a Created or Updated Emergency
 * 
 * Response from POST /emergency or POST /emergency/update
 * 
 * Served by Back-end to Front-end 
 */
export interface EmergencyBackendResponse {
    emergency_id: Number
}

/**
 * JSON Format of requesting reasonably distanced Emergencies
 *
 * For GET /emergency 
 * 
 * Served by Front-End to Back-end 
 */
export interface RequestEmergencies {
    latitude: Number
    longitude: Number
}

/**
 * JSON Format Response of requesting Emergencies
 * 
 * Response from GET /emergency
 * 
 * Served by Back-end to Front-end after requesting reasonably distanced Emergencies to a specific user
 */
export interface Emergencies {
    emergencies : EmergencyDetails[]
}

/**
 * JSON Format Response of an Emergency's details
 * 
 * Respone from GET /emergency/{id} or Emergencies array in GET /emergency
 * 
 * Served by Back-end to Front-end after requesting a specific emergency
 */
export interface EmergencyDetails {
    emergency_id: Number
    latitude?: Number
    longitude?: Number
    requires_911?: boolean
    emergency_type?: String
    self_emergency?: String
    description?: String
    requested_at?: String //ISO-8601 timestamp of when the emergency was created
}

/**
 * JSON Format of accepting an emergency
 * 
 * For POST /emergency/{id}/accept
 * 
 * Accepts an emergency
 */
export interface AcceptEmergency {
    user_id: Number
    emergency_id: Number
    ecdsa_signature: String
}

/**
 * JSON Format of requesting a emergency to be deleted
 * 
 * For DELETE /emergency/{id}/
 * 
 * Deletes a Emergency, must be requested from the original user
 */
export interface DeleteEmergency {
    user_id: Number
    emergency_id: Number
    ecdsa_signature: String
}

/**
 * JSON Format of reporting where you currently are for a given emergency
 * 
 * For POST /location/{emergencyId}/{label}, where label is "requester" or "responder"
 * 
 * Served by Front-end to Back-end
 */
export interface ReportLocation {
    latitude: Number
    longitude: Number
}

/**
 * JSON Format Response of how far the responder currently is from the requester
 * 
 * Response from GET /location/{emergencyId}/distance
 * 
 * Served by Back-end to Front-end
 */
export interface DistanceToResponder {
    distance_km: Number
    distance_miles: Number
    responder_latitude: Number
    responder_longitude: Number
}
