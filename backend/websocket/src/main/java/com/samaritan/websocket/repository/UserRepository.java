package com.samaritan.websocket.repository;

import com.samaritan.constants.api.CreateUser;

@org.springframework.stereotype.Repository
public class UserRepository {

    private final org.springframework.jdbc.core.simple.JdbcClient jdbc;

    public UserRepository(org.springframework.jdbc.core.simple.JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public com.samaritan.constants.api.CreateUserResponse create(CreateUser request) {
        long userId = jdbc.sql("""
                INSERT INTO users (ecdsa_public_key, is_samaritan, push_token)
                VALUES (?, ?, ?)
                RETURNING id
                """)
                .params(request.ecdsa_public_key(), request.is_samaritan(), request.push_token())
                .query(Long.class)
                .single();
        return new com.samaritan.constants.api.CreateUserResponse(userId);
    }

    public boolean isSamaritan(long userId) {
        return jdbc.sql("SELECT is_samaritan FROM users WHERE id = ?")
                .param(userId)
                .query(Boolean.class)
                .optional()
                .orElse(false);
    }

    public boolean exists(long userId) {
        return jdbc.sql("SELECT EXISTS (SELECT 1 FROM users WHERE id = ?)")
                .param(userId)
                .query(Boolean.class)
                .single();
    }

    public java.util.Optional<String> publicKeyFor(long userId) {
        return jdbc.sql("SELECT ecdsa_public_key FROM users WHERE id = ?")
                .param(userId)
                .query(String.class)
                .optional();
    }

    public boolean verifySignature(long userId, String payload, String signature) {
        return publicKeyFor(userId)
                .map(publicKey -> com.samaritan.utils.Ecdsa.verifyECDSA(payload, signature, publicKey))
                .orElse(false);
    }

    public boolean updatePushToken(long userId, String pushToken) {
        return jdbc.sql("UPDATE users SET push_token = ? WHERE id = ?")
                .params(pushToken, userId)
                .update() > 0;
    }
}