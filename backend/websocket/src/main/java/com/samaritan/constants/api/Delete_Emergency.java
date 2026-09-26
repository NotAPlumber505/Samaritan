package com.samaritan.constants.api;

public record Delete_Emergency(
        int user_id,
        int emergency_id,
        String ecdsa_signature
) {
}
