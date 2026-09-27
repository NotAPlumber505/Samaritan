package com.samaritan.websocket.controller;


import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.model.EmergencyDetails;
import com.samaritan.websocket.model.UpdateEmergencyMessage;
import com.samaritan.websocket.repository.EmergencyRepository;
import com.samaritan.websocket.service.EmergencyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.samaritan.constants.api.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyRepository emergencyRepository;
    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyRepository emergencyRepository, EmergencyService emergencyService) {
        this.emergencyRepository = emergencyRepository;
        this.emergencyService = emergencyService;
    }

    private static boolean invalidLocation(Double lat, Double lng) {
        // Location is optional, but if given, both parts must be present and in range
        return (lat == null) != (lng == null)
                || (lat != null && (lat < -90 || lat > 90 || lng < -180 || lng > 180));
    }


    @PostMapping
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency request) {
        if (invalidLocation(request.latitude(), request.longitude())) {
            return ResponseEntity.badRequest().build();
        }

        Emergency emergency = emergencyRepository.create(request);
        return new ResponseEntity<>(new CreateEmergencyResponse(emergency.getId()), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emergency> getEmergency(@PathVariable Long id){
        Optional<Emergency> emergency = emergencyRepository.findById(id);
        return emergency.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    // Same logic as the WebSocket update: owner check, save to the database, broadcast to watchers
    @PostMapping("/{id}/update")
    public ResponseEntity<EmergencyDetails> updateEmergency(@PathVariable long id,
                                                            @RequestBody UpdateEmergency request) {
        if (invalidLocation(request.latitude(), request.longitude())) {
            return ResponseEntity.badRequest().build();
        }

        UpdateEmergencyMessage update = new UpdateEmergencyMessage(
                request.user_id(),
                request.latitude(),
                request.longitude(),
                request.requires_911(),
                request.emergency_nature(),
                request.self_emergency(),
                request.description());

        return ResponseEntity.ok(emergencyService.applyUpdate(id, update));
    }

    // Goes through the service so WebSocket watchers get a DELETED event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergency(@PathVariable long id){
        emergencyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EmergencyNotFoundException.class)
    public ResponseEntity<Void> handleNotFound() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(NotEmergencyOwnerException.class)
    public ResponseEntity<Void> handleNotOwner() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Emergency>> getNearbyEmergencies(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5000") double radius) {

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || radius <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(emergencyRepository.findNearby(lat, lng, radius));
    }



}
