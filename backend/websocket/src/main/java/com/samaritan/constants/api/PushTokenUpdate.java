package com.samaritan.constants.api;

public record PushTokenUpdate(
        long user_id,
        String push_token,
        String ecdsa_signature
) {
}