package com.samaritan.websocket.controller;


import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.repository.EmergencyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.samaritan.constants.api.*;
import com.samaritan.utils.repositories.EmergencyTable;

import java.util.Optional;

@RestController
@RequestMapping("/emergency")
public class EmergencyController {

    private final EmergencyRepository emergencyRepository;

    public EmergencyController(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    @PostMapping
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency emergencyJSON) {
        int emergencyId = EmergencyTable.insertEmergency(emergencyJSON);
        CreateEmergencyResponse response = new CreateEmergencyResponse(emergencyId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Emergency> getEmergency(@PathVariable Long id){
        Optional<Emergency> emergency = emergencyRepository.findById(id);
        return emergency.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergency(@PathVariable Long id){
        return emergencyRepository.deleteById(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }




}
