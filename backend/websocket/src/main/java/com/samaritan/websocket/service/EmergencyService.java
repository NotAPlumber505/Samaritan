package com.samaritan.websocket.service;

import java.util.List;
import java.util.Optional;

import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.repository.EmergencyRepository;

@org.springframework.stereotype.Service
public class EmergencyService {
    private final EmergencyRepository repository;
    private final EmergencyEventPublisher publisher;
    private final com.samaritan.websocket.repository.UserRepository userRepository;
    private final com.samaritan.websocket.repository.EmergencyAcceptanceRepository acceptanceRepository;

    public EmergencyService(
            EmergencyRepository repository,
            EmergencyEventPublisher publisher,
            com.samaritan.websocket.repository.UserRepository userRepository,
            com.samaritan.websocket.repository.EmergencyAcceptanceRepository acceptanceRepository) {
        this.repository = repository;
        this.publisher = publisher;
        this.userRepository = userRepository;
        this.acceptanceRepository = acceptanceRepository;
    }

    public com.samaritan.websocket.model.EmergencyDetails create(
            long ownerUserId, double latitude, double longitude) {
        return repository.create(ownerUserId, latitude, longitude).toDetails();
    }

    public List<com.samaritan.websocket.model.EmergencyDetails> findAll() {
        return repository.findAll().stream()
                .map(Emergency::toDetails)
                .toList();
    }

    public Optional<com.samaritan.websocket.model.EmergencyDetails> findById(long emergencyId) {
        return repository.findById(emergencyId).map(Emergency::toDetails);
    }

    public void delete(long emergencyId, long requesterUserId, String signature) {
        Emergency emergency = repository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId));
        if (emergency.getOwnerUserId() != requesterUserId) {
            throw new NotEmergencyOwnerException(emergencyId);
        }
        verifySignature(requesterUserId,
                com.samaritan.utils.SignaturePayloads.emergencyAction(requesterUserId, emergencyId), signature);
        if (!repository.deleteByIdAndOwner(emergencyId, requesterUserId)) {
            throw new EmergencyNotFoundException(emergencyId);
        }
        publisher.emergencyDeleted(emergencyId);
    }

    public void accept(long emergencyId, long responderUserId, String signature) {
        repository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId));
        if (!userRepository.isSamaritan(responderUserId)) {
            throw new com.samaritan.websocket.exception.NotSamaritanException(responderUserId);
        }
        verifySignature(responderUserId,
                com.samaritan.utils.SignaturePayloads.emergencyAction(responderUserId, emergencyId), signature);
        if (acceptanceRepository.accept(emergencyId, responderUserId)) {
            publisher.emergencyAccepted(emergencyId, responderUserId);
        }
    }

    public com.samaritan.websocket.model.EmergencyDetails applyUpdate(
            long emergencyId,
            com.samaritan.websocket.model.UpdateEmergencyMessage update) {
        if (update == null || update.userId() == null) {
            throw new NotEmergencyOwnerException(emergencyId);
        }
        return applyUpdate(emergencyId, update,
                com.samaritan.utils.SignaturePayloads.websocketUpdate(
                        update.userId(), update.latitude(), update.longitude(), update.requires911(),
                        update.emergencyType(), update.selfEmergency(), update.description()));
    }

    public com.samaritan.websocket.model.EmergencyDetails applyRestUpdate(
            long emergencyId,
            com.samaritan.websocket.model.UpdateEmergencyMessage update) {
        if (update == null || update.userId() == null) {
            throw new NotEmergencyOwnerException(emergencyId);
        }
        return applyUpdate(emergencyId, update,
                com.samaritan.utils.SignaturePayloads.updateEmergency(
                update.userId(), emergencyId, update.latitude(), update.longitude(),
                update.requires911(), update.emergencyType(), update.selfEmergency(), update.description()));
    }

    private com.samaritan.websocket.model.EmergencyDetails applyUpdate(
            long emergencyId,
            com.samaritan.websocket.model.UpdateEmergencyMessage update,
            String signedPayload) {
        Emergency emergency = repository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId));
        if (update.userId() == null || update.userId() != emergency.getOwnerUserId()) {
            throw new NotEmergencyOwnerException(emergencyId);
        }
        verifySignature(update.userId(), signedPayload, update.ecdsaSignature());

        com.samaritan.websocket.model.EmergencyDetails details;
        synchronized (emergency) {
            emergency.applyUpdate(update);
            if (!repository.update(emergency)) {
                throw new EmergencyNotFoundException(emergencyId);
            }
            details = emergency.toDetails();
        }

        publisher.emergencyUpdated(emergencyId, details);

        return details;



    }

    private void verifySignature(long userId, String payload, String signature) {
        if (!userRepository.verifySignature(userId, payload, signature)) {
            throw new com.samaritan.websocket.exception.InvalidSignatureException(userId);
        }
    }





}
