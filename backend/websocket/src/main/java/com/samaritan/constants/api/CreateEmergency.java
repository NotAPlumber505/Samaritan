package com.samaritan.constants.api;


public record CreateEmergency(
        long user_id,
        Double latitude,
        Double longitude,
        Boolean requires_911,
        String emergency_type,
        String self_emergency,
        String description,
        String ecdsa_signature
) {}