package com.samaritan.websocket.controller;


import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.repository.EmergencyRepository;
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

    public EmergencyController(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }


    @PostMapping
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency request) {
        double lat = request.latitude();
        double lng = request.longitude();

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return ResponseEntity.badRequest().build();
        }

        Emergency emergency = emergencyRepository.create(request.user_id(), lat, lng);
        return new ResponseEntity<>(new CreateEmergencyResponse(emergency.getId()), HttpStatus.CREATED);
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
