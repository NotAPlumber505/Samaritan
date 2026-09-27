package com.samaritan.websocket.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.samaritan.constants.api.*;
import com.samaritan.utils.repositories.EmergencyTable;
import com.samaritan.websocket.repository.UserRepository;
import com.samaritan.websocket.model.User;
import com.samaritan.websocket.service.ExpoNotificationService;

import java.util.List;

@RestController
@RequestMapping("/emergency")
public class EmergencyController {
    
 private final UserRepository userRepository;
    private final ExpoNotificationService notificationService;

    public EmergencyController(UserRepository userRepository, ExpoNotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    @PostMapping

    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency emergencyJSON) {
    int emergencyId = EmergencyTable.insertEmergency(emergencyJSON);

    List<String> tokens = userRepository.findSamaritansWithPushToken().stream()
            .map(User::getPushToken)
            .toList();
    notificationService.sendEmergencyAlert(tokens, emergencyId);

    CreateEmergencyResponse response = new CreateEmergencyResponse(emergencyId);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}

}
