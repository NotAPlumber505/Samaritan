package com.samaritan.websocket.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateEmergencyMessage(
        @JsonProperty("User_ID") Long userId,
        @JsonProperty("Latitude") Double latitude,
        @JsonProperty("Longitude") Double longitude,
        @JsonProperty("Requires_911") Boolean requires911,
        @JsonProperty("Emergency_Nature") String emergencyType,
        @JsonProperty("Self_Emergency") String selfEmergency,
        @JsonProperty("Description") String description
) {
}
