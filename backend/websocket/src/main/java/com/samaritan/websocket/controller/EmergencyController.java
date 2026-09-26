package com.samaritan.websocket.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.samaritan.constants.api.*;
import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.UpdateEmergencyMessage;
import com.samaritan.websocket.service.EmergencyService;

import java.util.List;

@RestController
@RequestMapping("/emergency")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency emergencyJSON) {
        com.samaritan.websocket.model.EmergencyDetails emergency = emergencyService.create(
                emergencyJSON.user_id(), emergencyJSON.latitude(), emergencyJSON.longitude());
        CreateEmergencyResponse response = new CreateEmergencyResponse(Math.toIntExact(emergency.emergencyId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergency(@PathVariable int id) {
        emergencyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update")
    public ResponseEntity<CreateEmergencyResponse> updateEmergency(@RequestBody UpdateEmergency update) {
        UpdateEmergencyMessage message = new UpdateEmergencyMessage(
                update.user_id(),
                update.latitude(),
                update.longitude(),
                update.requires_911(),
                update.emergency_nature(),
                update.self_emergency(),
                update.description());
        emergencyService.applyUpdate(update.emergency_id(), message);
        return ResponseEntity.ok(new CreateEmergencyResponse(update.emergency_id()));
    }

    @GetMapping
    public ResponseEntity<Emergencies> getEmergencies() {
        List<EmergencyDetails> emergencies = emergencyService.findAll().stream()
                .map(this::toApiDetails)
                .toList();
        return ResponseEntity.ok(new Emergencies(emergencies.toArray(EmergencyDetails[]::new)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyDetails> getEmergency(@PathVariable int id) {
        return emergencyService.findById(id)
                .map(this::toApiDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(EmergencyNotFoundException.class)
    public ResponseEntity<Void> handleEmergencyNotFound() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(NotEmergencyOwnerException.class)
    public ResponseEntity<Void> handleNotEmergencyOwner() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    private EmergencyDetails toApiDetails(com.samaritan.websocket.model.EmergencyDetails details) {
        return new EmergencyDetails(
                Math.toIntExact(details.emergencyId()),
                details.latitude(),
                details.longitude(),
                details.requires911(),
                details.emergencyType(),
                details.selfEmergency(),
                details.description(),
                details.requestedAt());
    }
}
