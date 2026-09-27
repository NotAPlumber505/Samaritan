package com.samaritan.constants.api;

public record CreateUser(
        String ecdsa_public_key,
        boolean is_samaritan,
        String push_token
) {
}
