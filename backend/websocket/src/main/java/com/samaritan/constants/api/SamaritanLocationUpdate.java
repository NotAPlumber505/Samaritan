package com.samaritan.constants.api;

public record SamaritanLocationUpdate(
        long user_id,
        double latitude,
        double longitude,
        String ecdsa_signature
) {
}