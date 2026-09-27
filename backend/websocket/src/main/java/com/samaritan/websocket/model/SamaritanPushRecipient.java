package com.samaritan.websocket.model;

public record SamaritanPushRecipient(
        long userId,
        String pushToken,
        double latitude,
        double longitude
) {
}