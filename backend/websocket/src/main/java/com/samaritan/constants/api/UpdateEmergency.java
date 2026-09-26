package com.samaritan.constants.api;

/**
 * All fields except user_id and ecdsa_verification are optional.
 * */
public record UpdateEmergency(
        int user_id,
        Double latitude,
        Double longitude,
        Boolean requires_911,
        String emergency_type,
        Boolean self_emergency,
        String description,
        String ecdsa_verification
) {
}
