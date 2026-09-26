package com.samaritan.constants.api;

/**
 * All fields except emergency_id are optional*/
public record EmergencyDetails(
        int emergency_id,
        Double latitude,
        Double longitude,
        Boolean requires_911,
        String emergency_type,
        String self_emergency,
        String description,
        String requested_at
) {
}
