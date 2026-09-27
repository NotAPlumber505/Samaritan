package com.samaritan.websocket.service;

import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.model.EmergencyDetails;
import com.samaritan.websocket.model.UpdateEmergencyMessage;
import com.samaritan.websocket.repository.EmergencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyService {
    private final EmergencyRepository repository;
    private final EmergencyEventPublisher publisher;


    public EmergencyService(EmergencyRepository repository, EmergencyEventPublisher publisher){
        this.repository = repository;
        this.publisher = publisher;
    }

    public EmergencyDetails create(long ownerUserId, double latitude, double longitude) {
        return repository.create(ownerUserId, latitude, longitude).toDetails();
    }

    public List<EmergencyDetails> findAll() {
        return repository.findAll().stream()
                .map(Emergency::toDetails)
                .toList();
    }

    public Optional<EmergencyDetails> findById(long emergencyId) {
        return repository.findById(emergencyId).map(Emergency::toDetails);
    }

    public void delete(long emergencyId) {
        if (!repository.deleteById(emergencyId)) {
            throw new EmergencyNotFoundException(emergencyId);
        }
        publisher.emergencyDeleted(emergencyId);
    }

    public EmergencyDetails applyUpdate(long emergencyId, UpdateEmergencyMessage update){
        Emergency emergency = repository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId));

        if(update.userId() == null || update.userId() != emergency.getOwnerUserId() ){
            throw new NotEmergencyOwnerException(emergencyId);
        }

        emergency.applyUpdate(update);

        // Persist before broadcasting, so watchers never see a change that wasn't saved
        if (!repository.update(emergency)) {
            throw new EmergencyNotFoundException(emergencyId); // deleted in the meantime
        }

        EmergencyDetails details = emergency.toDetails();
        publisher.emergencyUpdated(emergencyId, details);

        return details;



    }





}
