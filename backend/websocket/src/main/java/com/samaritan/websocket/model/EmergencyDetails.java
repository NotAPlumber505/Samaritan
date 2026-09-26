package com.samaritan.websocket.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmergencyDetails(
        @JsonProperty("Emergency_ID") long emergencyId,
        @JsonProperty("Latitude") Double latitude,
        @JsonProperty("Longitude") Double longitude,
        @JsonProperty("Requires_911") Boolean requires911,
        @JsonProperty("Emergency_Type") String emergencyType,
        @JsonProperty("Self_Emergency") String selfEmergency,
        @JsonProperty("Description") String description,
        @JsonProperty("Requested_At") String requestedAt
) {
}
