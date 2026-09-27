package com.samaritan.websocket.controller;

import com.samaritan.constants.api.CreateUser;
import com.samaritan.constants.api.PushTokenUpdate;
import com.samaritan.constants.api.SamaritanLocationUpdate;
import com.samaritan.websocket.repository.SamaritanLocationRepository;
import com.samaritan.websocket.repository.UserRepository;

@org.springframework.web.bind.annotation.RestController
@org.springframework.web.bind.annotation.RequestMapping("/user")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final SamaritanLocationRepository locationRepository;

    public UserController(UserRepository userRepository, SamaritanLocationRepository locationRepository) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
    }

    @org.springframework.web.bind.annotation.PostMapping
    public org.springframework.http.ResponseEntity<com.samaritan.constants.api.CreateUserResponse> createUser(
            @org.springframework.web.bind.annotation.RequestBody CreateUser request) {
        if (request.ecdsa_public_key() == null || request.ecdsa_public_key().isBlank()
                || !validOptionalCoordinate(request.latitude(), -90, 90)
                || !validOptionalCoordinate(request.longitude(), -180, 180)
                || ((request.latitude() == null) != (request.longitude() == null))) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        var created = userRepository.create(request);
        if (request.is_samaritan() && request.latitude() != null) {
            locationRepository.upsert(created.user_id(), request.latitude(), request.longitude());
        }
        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(created);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{userId}/location")
    public org.springframework.http.ResponseEntity<Void> updateSamaritanLocation(
            @org.springframework.web.bind.annotation.PathVariable long userId,
            @org.springframework.web.bind.annotation.RequestBody SamaritanLocationUpdate update) {
        if (update.user_id() != userId || !validCoordinates(update.latitude(), update.longitude())) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        if (!userRepository.isSamaritan(userId)
                || !userRepository.verifySignature(userId,
                        com.samaritan.utils.SignaturePayloads.createEmergency(
                                userId, update.latitude(), update.longitude()),
                        update.ecdsa_signature())) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        locationRepository.upsert(userId, update.latitude(), update.longitude());
        return org.springframework.http.ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.PutMapping("/{userId}/push-token")
    public org.springframework.http.ResponseEntity<Void> updatePushToken(
            @org.springframework.web.bind.annotation.PathVariable long userId,
            @org.springframework.web.bind.annotation.RequestBody PushTokenUpdate update) {
        if (update.user_id() != userId || update.push_token() == null || update.push_token().isBlank()) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        String signedPayload = com.samaritan.utils.SignaturePayloads.userPushToken(userId, update.push_token());
        if (!userRepository.verifySignature(userId, signedPayload, update.ecdsa_signature())) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        return userRepository.updatePushToken(userId, update.push_token())
                ? org.springframework.http.ResponseEntity.noContent().build()
                : org.springframework.http.ResponseEntity.notFound().build();
    }

    private boolean validCoordinates(double latitude, double longitude) {
        return Double.isFinite(latitude) && Double.isFinite(longitude)
                && latitude >= -90 && latitude <= 90
                && longitude >= -180 && longitude <= 180;
    }

    private boolean validOptionalCoordinate(Double value, double minimum, double maximum) {
        return value == null || (Double.isFinite(value) && value >= minimum && value <= maximum);
    }
}