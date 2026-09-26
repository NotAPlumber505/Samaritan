package com.samaritan.websocket.model.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmergencyEvent(
        @JsonProperty("Type") EmergencyEventType type,
        @JsonProperty("Emergency_ID") long emergencyId,
        @JsonProperty("Data") Object data,
        @JsonProperty("Timestamp") long timestamp


) {
}
