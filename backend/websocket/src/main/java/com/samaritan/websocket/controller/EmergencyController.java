package com.samaritan.websocket.controller;


import com.samaritan.websocket.entity.EmergencyEntity;
import com.samaritan.websocket.model.Emergency;
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

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }


    @PostMapping
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency request) {
        double lat = request.latitude();
        double lng = request.longitude();

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return ResponseEntity.badRequest().build();
        }

        EmergencyEntity emergency = new EmergencyEntity(request.user_id(), lat, lng, null, null, null, null);
        return new ResponseEntity<>(new CreateEmergencyResponse(emergency.getEmergencyId()), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<CreateEmergencyResponse> getEmergency(@PathVariable Long id){
        Optional<EmergencyEntity> emergency = emergencyService.findEmergencyById(id);
        return emergencyService.findEmergencyById(id)
                .map(entity -> ResponseEntity.ok(new CreateEmergencyResponse(entity.getEmergencyId()))) // Or however you map Entity -> DTO
                .orElseGet(() -> ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergency(@PathVariable Long id){
        return emergencyService.deleteById(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<EmergencyEntity>> getNearbyEmergencies(
            @RequestParam double Latitude,
            @RequestParam double Longitude) {

        if (Latitude < -90 || Latitude > 90 || Longitude < -180 || Longitude > 180 || 2000 <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @PostMapping("/update")
    public ResponseEntity<CreateEmergencyResponse> updateEmergency(@RequestBody UpdateEmergency json){
        return new ResponseEntity<>(new CreateEmergencyResponse(emergencyService.updateEmergency((long) json.emergency_id(),new EmergencyEntity(json.user_id(), json.latitude(),json.longitude(),json.requires_911(),json.emergency_nature(), json.self_emergency() ,json.description())).getEmergencyId()), HttpStatus.CREATED);


    }


}
