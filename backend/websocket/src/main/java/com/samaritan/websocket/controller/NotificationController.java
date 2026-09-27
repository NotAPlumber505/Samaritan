package com.samaritan.websocket.controller;
//This will be exposing the actual web endpoints to the frontend so it can call the network over once built

import com.samaritan.websocket.model.ExpoNotificationRequest;
import com.samaritan.websocket.service.ExpoNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private ExpoNotificationService notificationService;

    // Endpoint for frontend to register/save device tokens
    @PostMapping("/register-token") // where the app drops off its device token
    public ResponseEntity<String> registerToken(@RequestBody ExpoNotificationRequest request) {
        System.out.println("Received push token from frontend: " + request.getToken());
        return ResponseEntity.ok("Token registered successfully!");
    }

    // Endpoint to manually trigger a push notification ^_^ teehee
    @PostMapping("/send") //where notifications are triggered
    public ResponseEntity<String> sendNotification(@RequestBody ExpoNotificationRequest request) {
        notificationService.sendPushNotification(request);
        return ResponseEntity.ok("Notification request sent to Expo!");
    }
}
