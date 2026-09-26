package com.samaritan.websocket.model;

import com.fasterxml.jackson.annotation.JsonProperty;

// Response for GET /location/{emergencyId}/distance
public record DistanceToResponderResponse(
        @JsonProperty("Distance_Km") double distanceKm,
        @JsonProperty("Distance_Miles") double distanceMiles,
        @JsonProperty("Responder_Latitude") double responderLatitude,
        @JsonProperty("Responder_Longitude") double responderLongitude
) {
}
