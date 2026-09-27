package com.samaritan.constants.api;

/** Request body for POST /emergency/update. The mock endpoint does not verify the signature. */
public record UpdateEmergency(
        int emergency_id,
        Long user_id,
        Double latitude,
        Double longitude,
        Boolean requires_911,
        String emergency_nature,
        String self_emergency,
        String description,
        String ecdsa_signature
) {
}
