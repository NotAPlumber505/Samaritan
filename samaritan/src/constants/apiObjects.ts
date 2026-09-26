/**
 * JSON Format of requesting a user to be created
 * 
 * For POST /user
 * 
 * Served by Front-end to Back-end
 */
export interface CreateUser {
    ECDSA_public_key: String
    Is_Samaritan: boolean //Opt-in: true if the user agreed, on first app open, to respond to nearby emergencies
    Push_Token?: String //Expo push notification token, used to notify this user of nearby emergencies
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
    User_ID: Number
}

/**
 * JSON Format of creating an Emergency
 * 
 * For POST /emergency
 * 
 * Served by Front-end to Back-end 
*/
export interface CreateEmergency {
    user_ID: Number
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
    user_ID: String
    emergency_ID: Number
    latitude?: Number
    longitude?: Number
    requires_911?: boolean
    emergency_Nature?: String
    self_Emergency?: String
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
    emergency_ID: Number
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
    emergency_ID: Number
    latitude?: Number
    longitude?: Number
    requires_911?: boolean
    emergency_Type?: String
    self_Emergency?: String
    description?: String
    requested_At?: String //ISO-8601 timestamp of when the emergency was created
}

/**
 * JSON Format of accepting an emergency
 * 
 * For POST /emergency/{id}/accept
 * 
 * Accepts an emergency
 */
export interface AcceptEmergency {
    user_ID: String
    emergency_ID: Number
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
    user_ID: Number
    emergency_ID: Number
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
    distance_Km: Number
    distance_Miles: Number
    responder_Latitude: Number
    responder_Longitude: Number
}
