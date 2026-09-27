package com.samaritan.websocket.service;

import com.samaritan.websocket.model.ExpoNotificationRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpoNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPushNotification(ExpoNotificationRequest request) {
        Map<String, Object> payload = buildBasePayload(request.getToken(), request.getTitle(), request.getBody());
        Map<String, String> data = new HashMap<>();
        data.put("clickAction", "EMERGENCY_SCREEN");
        payload.put("data", data);
        sendPayload(payload);
    }

    /**
     * Sends the same emergency alert to every token in the list. This is what EmergencyController
     * calls automatically on a new emergency, instead of relying on a manual /send call.
     */
    public void sendEmergencyAlert(List<String> tokens, long emergencyId) {
        for (String token : tokens) {
            Map<String, Object> payload = buildBasePayload(
                    token, "Nearby emergency", "Someone nearby needs help. Tap to view details.");
            Map<String, Object> data = new HashMap<>();
            data.put("clickAction", "EMERGENCY_SCREEN");
            data.put("emergencyId", emergencyId);
            payload.put("data", data);
            sendPayload(payload);
        }
    }

    private Map<String, Object> buildBasePayload(String token, String title, String body) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("to", token);
        payload.put("title", title);
        payload.put("body", body);
        payload.put("sound", "default");
        return payload;
    }

    private void sendPayload(Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");
        headers.set("Accept-Encoding", "gzip, deflate");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, entity, String.class);
            System.out.println("Expo Notification Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Error sending push notification via Expo: " + e.getMessage());
        }
    }
}