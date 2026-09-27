package com.samaritan.websocket.model; //will be holding the payload fields (token, title, body, and userId's)
//Acting like a blueprint for the JSON payloads the will be going between the front and back. :3

public class ExpoNotificationRequest {
    private String token;
    private String title;
    private String body;
    private String userId;


    //Yay constructors
    public ExpoNotificationRequest(){}

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
