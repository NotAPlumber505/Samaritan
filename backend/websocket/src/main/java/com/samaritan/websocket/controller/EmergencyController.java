package com.samaritan.websocket.controller;


import java.util.Map;
import java.util.Optional;

import com.samaritan.constants.api.Accept_Emergency;
import com.samaritan.constants.api.CreateEmergency;
import com.samaritan.constants.api.CreateEmergencyResponse;
import com.samaritan.constants.api.Delete_Emergency;
import com.samaritan.constants.api.Emergencies;
import com.samaritan.constants.api.UpdateEmergency;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.repository.EmergencyRepository;
import com.samaritan.websocket.repository.UserRepository;
import com.samaritan.websocket.service.EmergencyPushService;
import com.samaritan.websocket.service.EmergencyService;

@org.springframework.web.bind.annotation.RestController
@org.springframework.web.bind.annotation.RequestMapping("/emergency")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyRepository emergencyRepository;
    private final EmergencyService emergencyService;
    private final UserRepository userRepository;
    private final EmergencyPushService pushService;

    public EmergencyController(
            EmergencyRepository emergencyRepository,
            EmergencyService emergencyService,
            UserRepository userRepository,
            EmergencyPushService pushService) {
        this.emergencyRepository = emergencyRepository;
        this.emergencyService = emergencyService;
        this.userRepository = userRepository;
        this.pushService = pushService;
    }


    @org.springframework.web.bind.annotation.PostMapping
    public org.springframework.http.ResponseEntity<CreateEmergencyResponse> postEmergency(
            @org.springframework.web.bind.annotation.RequestBody CreateEmergency request) {
        double lat = request.latitude();
        double lng = request.longitude();

        if (request.user_id() <= 0 || !userRepository.exists(request.user_id())
            || !validCoordinates(lat, lng)) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        if (!userRepository.verifySignature(request.user_id(),
                com.samaritan.utils.SignaturePayloads.createEmergency(request.user_id(), lat, lng),
                request.ecdsa_signature())) {
            throw new com.samaritan.websocket.exception.InvalidSignatureException(request.user_id());
        }

        Emergency emergency = emergencyRepository.create(request.user_id(), lat, lng);
        pushService.notifyNearbySamaritans(emergency.getId(), request.user_id(), lat, lng);
        return new org.springframework.http.ResponseEntity<>(new CreateEmergencyResponse(emergency.getId()),
                org.springframework.http.HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.GetMapping
    public org.springframework.http.ResponseEntity<Emergencies> getNearbyEmergencies(
            @org.springframework.web.bind.annotation.RequestParam("Latitude") double latitude,
            @org.springframework.web.bind.annotation.RequestParam("Longitude") double longitude,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "5000") double radius) {
        if (!validCoordinates(latitude, longitude) || radius <= 0) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        com.samaritan.constants.api.EmergencyDetails[] results = emergencyRepository
                .findNearby(latitude, longitude, radius)
                .stream()
                .map(this::toApiDetails)
                .toArray(com.samaritan.constants.api.EmergencyDetails[]::new);
        return org.springframework.http.ResponseEntity.ok(new Emergencies(results));
    }

    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<com.samaritan.constants.api.EmergencyDetails> getEmergency(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        Optional<Emergency> emergency = emergencyRepository.findById(id);
        return emergency.map(value -> org.springframework.http.ResponseEntity.ok(toApiDetails(value)))
                .orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());

    }

    @org.springframework.web.bind.annotation.PostMapping("/update")
    public org.springframework.http.ResponseEntity<CreateEmergencyResponse> updateEmergency(
            @org.springframework.web.bind.annotation.RequestBody UpdateEmergency request) {
        if (request.user_id() == null || request.user_id() <= 0 || request.emergency_id() <= 0
            || !validOptionalCoordinate(request.latitude(), -90, 90)
            || !validOptionalCoordinate(request.longitude(), -180, 180)) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        emergencyService.applyRestUpdate(request.emergency_id(), new com.samaritan.websocket.model.UpdateEmergencyMessage(
                request.user_id(), request.latitude(), request.longitude(), request.requires_911(),
            request.emergency_nature(), request.self_emergency(), request.description(), request.ecdsa_signature()));
        return org.springframework.http.ResponseEntity.ok(new CreateEmergencyResponse(request.emergency_id()));
    }

    @org.springframework.web.bind.annotation.PostMapping("/{id}/accept")
    public org.springframework.http.ResponseEntity<CreateEmergencyResponse> acceptEmergency(
            @org.springframework.web.bind.annotation.PathVariable long id,
            @org.springframework.web.bind.annotation.RequestBody Accept_Emergency request) {
        if (request.emergency_id() != id || request.user_id() <= 0) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        emergencyService.accept(id, request.user_id(), request.ecdsa_signature());
        return org.springframework.http.ResponseEntity.ok(new CreateEmergencyResponse(id));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> deleteEmergency(
            @org.springframework.web.bind.annotation.PathVariable long id,
            @org.springframework.web.bind.annotation.RequestBody Delete_Emergency request) {
        if (request.emergency_id() != id || request.user_id() <= 0) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        emergencyService.delete(id, request.user_id(), request.ecdsa_signature());
        return org.springframework.http.ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(
            com.samaritan.websocket.exception.EmergencyNotFoundException.class)
    public org.springframework.http.ResponseEntity<Map<String, String>> emergencyNotFound(RuntimeException exception) {
        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .body(Map.of("error", exception.getMessage()));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler({
            com.samaritan.websocket.exception.NotEmergencyOwnerException.class,
            com.samaritan.websocket.exception.NotSamaritanException.class,
            com.samaritan.websocket.exception.InvalidSignatureException.class
    })
    public org.springframework.http.ResponseEntity<Map<String, String>> forbidden(RuntimeException exception) {
        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                .body(Map.of("error", exception.getMessage()));
    }

    private boolean validCoordinates(double latitude, double longitude) {
        return Double.isFinite(latitude) && Double.isFinite(longitude)
                && latitude >= -90 && latitude <= 90
                && longitude >= -180 && longitude <= 180;
    }

    private boolean validOptionalCoordinate(Double value, double minimum, double maximum) {
        return value == null || (Double.isFinite(value) && value >= minimum && value <= maximum);
    }

    private com.samaritan.constants.api.EmergencyDetails toApiDetails(Emergency emergency) {
        return new com.samaritan.constants.api.EmergencyDetails(
                emergency.getId(), emergency.getLatitude(), emergency.getLongitude(),
                emergency.getRequires911(), emergency.getEmergencyType(), emergency.getSelfEmergency(),
                emergency.getDescription(), emergency.getRequestedAt().toString());
    }
}
