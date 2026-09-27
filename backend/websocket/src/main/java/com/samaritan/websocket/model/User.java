package com.samaritan.websocket.model;

public class User {
    private final long id;
    private final String ecdsaPublicKey;
    private boolean samaritan;
    private String pushToken;

    public User(long id, String ecdsaPublicKey, boolean samaritan, String pushToken) {
        this.id = id;
        this.ecdsaPublicKey = ecdsaPublicKey;
        this.samaritan = samaritan;
        this.pushToken = pushToken;
    }

    public long getId() { return id; }
    public String getEcdsaPublicKey() { return ecdsaPublicKey; }
    public boolean isSamaritan() { return samaritan; }
    public void setSamaritan(boolean samaritan) { this.samaritan = samaritan; }
    public String getPushToken() { return pushToken; }
    public void setPushToken(String pushToken) { this.pushToken = pushToken; }
}
