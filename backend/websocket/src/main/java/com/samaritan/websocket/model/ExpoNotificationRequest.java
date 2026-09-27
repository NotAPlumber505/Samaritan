package com.samaritan.websocket.model;

public class ExpoNotificationRequest {
    
    private String to;       // The Expo push token (e.g., "ExponentPushToken[xxxxxx]")
    private String title;    // Notification title
    private String body;     // Notification message body
    private Object data;     // Optional custom payload data

    // Default Constructor
    public ExpoNotificationRequest() {}

    // Getters and Setters
    public String getToken() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}