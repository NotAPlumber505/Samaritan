package com.samaritan.websocket.model;

public record UpdateEmergencyMessage(
        @com.fasterxml.jackson.annotation.JsonProperty("user_id") Long userId,
        @com.fasterxml.jackson.annotation.JsonProperty("latitude") Double latitude,
        @com.fasterxml.jackson.annotation.JsonProperty("longitude") Double longitude,
        @com.fasterxml.jackson.annotation.JsonProperty("requires_911") Boolean requires911,
        @com.fasterxml.jackson.annotation.JsonProperty("emergency_nature") String emergencyType,
        @com.fasterxml.jackson.annotation.JsonProperty("self_emergency") String selfEmergency,
        @com.fasterxml.jackson.annotation.JsonProperty("description") String description,
        @com.fasterxml.jackson.annotation.JsonProperty("ecdsa_signature") String ecdsaSignature
) {
}
