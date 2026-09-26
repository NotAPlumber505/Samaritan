package com.samaritan.constants.api;

public record CreateEmergency(
    int user_id,
    double latitude,
    double longitude,
    String ecdsa_signature
) {
}
