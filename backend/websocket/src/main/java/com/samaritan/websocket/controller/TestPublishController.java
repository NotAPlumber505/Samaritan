package com.samaritan.websocket.controller;

import com.samaritan.websocket.model.EmergencyDetails;
import com.samaritan.websocket.repository.EmergencyRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// TEMPORARY: manual testing only
@RestController
public class TestPublishController {

    private final EmergencyRepository emergencyRepository;

    public TestPublishController(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    // e.g. http://localhost:8080/test/emergency/create?userId=100&lat=40.71&lon=-74.00
    @GetMapping("/test/emergency/create")
    public EmergencyDetails create(@RequestParam long userId,
                                   @RequestParam double lat,
                                   @RequestParam double lon) {
        return emergencyRepository.create(userId, lat, lon).toDetails();
    }
}