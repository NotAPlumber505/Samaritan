package com.samaritan.websocket.controller;

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

    // Manual test hook -- POST a token/title/body here to confirm delivery without waiting on a real emergency.
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody ExpoNotificationRequest request) {
        notificationService.sendPushNotification(request);
        return ResponseEntity.ok("Notification request sent to Expo!");
    }
}