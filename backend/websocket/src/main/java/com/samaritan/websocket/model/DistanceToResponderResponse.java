package com.samaritan.websocket.model;

// Response for GET /location/{emergencyId}/distance
public record DistanceToResponderResponse(
        double distance_km,
        double distance_miles,
        double responder_latitude,
        double responder_longitude
) {
}
