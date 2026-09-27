package com.samaritan.websocket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long userId;

    @Column(name = "ecdsa_public_key", nullable = false, columnDefinition = "TEXT")
    private String ecdsaPublicKey;

    @Column(name = "is_samaritan", nullable = false, columnDefinition = "BOOLEAN")
    private boolean isSamaritan = false;

    @Column(name = "push_token")
    private String pushToken;

    public UserEntity() {}

    public UserEntity(String ecdsaPublicKey, boolean isSamaritan, String pushToken) {
        this.ecdsaPublicKey = ecdsaPublicKey;
        this.isSamaritan = isSamaritan;
        this.pushToken = pushToken;
    }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getEcdsaPublicKey() { return ecdsaPublicKey; }
    public void setEcdsaPublicKey(String ecdsaPublicKey) { this.ecdsaPublicKey = ecdsaPublicKey; }

    public boolean getIsSamaritan() { return isSamaritan; }
    public void setIsSamaritan(boolean isSamaritan) { this.isSamaritan = isSamaritan; }

    public String getPushToken() { return pushToken; }
    public void setPushToken(String pushToken) { this.pushToken = pushToken; }


}

