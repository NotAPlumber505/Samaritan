package com.samaritan.websocket.service;

//This section shall moving forward contain the logic for communication with the Expo. Utilizing
// Spring's template so it will construct the proper Http headers, and packages the notification details, and
//fires a POST request off to Expo's push server

import com.samaritan.websocket.model.ExpoNotificationRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExpoNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final RestTemplate restTemplate = new RestTemplate();


    public void sendPushNotification(ExpoNotificationRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");
        headers.set("Accept-Encoding", "gzip, deflate");

        Map<String, Object> body = new HashMap<>();
        body.put("to", request.getToken());
        body.put("title", request.getTitle());
        body.put("body", request.getBody());
        body.put("sound", "default");

        Map<String, String> data = new HashMap<>();
        data.put("clickAction", "EMERGENCY_SCREEN");
        body.put("data", data);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, entity, String.class);
            System.out.println("Expo Notification Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Error sending push notification via Expo: " + e.getMessage());
        }
    }
}