package com.samaritan.constants.api;

/** Request body for POST /emergency/{id}/update. The path id wins over emergency_id; the signature is not verified yet. */
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
