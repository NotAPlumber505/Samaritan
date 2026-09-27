package com.samaritan.constants.api;



public record CreateEmergency(
        long user_id,
        double latitude,
        double longitude,
        String ecdsa_signature
) {}
