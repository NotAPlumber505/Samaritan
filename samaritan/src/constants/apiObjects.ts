/**
 * JSON Format of requesting a user to be created
 * 
 * For POST /user
 * 
 * Served by Front-end to Back-end
 */
interface CreateUser {
    ECDSA_public_key: String
}

/**
 * JSON Format of requesting a user to be created
 * 
 * Response from POST /user
 * 
 * Served by Back-end to Front-End
 */
interface CreateUserResponse {
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
    User_ID: Number
    Latitude: Number
    Longitude: Number
    ECDSA_r: Number //ECDSA verification first integer part
    ECDSA_s: Number //ECDSA verification second integer part
}

/**
 * JSON Format of updating an Emergency
 * 
 * For POST /emergency/update 
 * 
 * Served by Front-end to Back-end 
*/
interface UpdateEmergency {
    User_ID: String
    Latitude?: Number
    Longitude?: Number
    Requires_911?: boolean
    Emergency_Nature?: String
    Self_Emergency?: String
    Description?: String
    ECDSA_r: Number
    ECDSA_s: Number
}

/**
 * JSON Format Response of a Created or Updated Emergency
 * 
 * Response from POST /emergency or POST /emergency/update
 * 
 * Served by Back-end to Front-end 
 */
export interface EmergencyBackendResponse {
    Emergency_ID: Number
}

/**
 * JSON Format of requesting reasonably distanced Emergencies
 *
 * For GET /emergency 
 * 
 * Served by Front-End to Back-end 
 */
interface RequestEmergencies {
    Latitude: Number
    Longitude: Number
}

/**
 * JSON Format Response of requesting Emergencies
 * 
 * Response from GET /emergency
 * 
 * Served by Back-end to Front-end after requesting reasonably distanced Emergencies to a specific user
 */
interface Emergencies {
    Emergencies : EmergencyDetails[]
}

/**
 * JSON Format Response of an Emergency's details
 * 
 * Respone from GET /emergency/{id} or Emergencies array in GET /emergency
 * 
 * Served by Back-end to Front-end after requesting a specific emergency
 */
interface EmergencyDetails {
    Emergency_ID: Number
    Latitude?: Number
    Longitude?: Number
    Requires_911?: boolean
    Emergency_Type?: String
    Self_Emergency?: String
    Description?: String
}

/**
 * JSON Format of accepting an emergency
 * 
 * For POST /emergency/{id}/accept
 * 
 * Accepts an emergency
 */
interface Accept_Emergency {
    User_ID: String
    Emergency_ID: Number
    ECDSA_r: Number
    ECDSA_s: Number
}

/**
 * JSON Format of requesting a emergency to be marked as resolve
 * 
 * For POST /emergency/{id}/resolve
 * 
 * Resolves a Emergency, must be requested from the original user
 */
interface Delete_Emergency {
    User_ID: Number
    Emergency_ID: Number
    ECDSA_r: Number
    ECDSA_s: Number
}


/**
 * JSON Format of requesting a emergency to be deleted
 * 
 * For DELETE /emergency/{id}/
 * 
 * Deletes a Emergency, must be requested from the original user
 */
interface Delete_Emergency {
    User_ID: Number
    Emergency_ID: Number
    ECDSA_r: Number
    ECDSA_s: Number
}
