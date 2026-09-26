package com.samaritan.websocket.service;

import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.model.EmergencyDetails;
import com.samaritan.websocket.model.UpdateEmergencyMessage;
import com.samaritan.websocket.repository.EmergencyRepository;
import org.springframework.stereotype.Service;

@Service
public class EmergencyService {
    private final EmergencyRepository repository;
    private final EmergencyEventPublisher publisher;


    public EmergencyService(EmergencyRepository repository, EmergencyEventPublisher publisher){
        this.repository = repository;
        this.publisher = publisher;
    }

    public EmergencyDetails applyUpdate(long emergencyId, UpdateEmergencyMessage update){
        Emergency emergency = repository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId));

        if(update.userId() == null || update.userId() != emergency.getOwnerUserId() ){
            throw new NotEmergencyOwnerException(emergencyId);
        }

        EmergencyDetails details;
        synchronized (emergency) {
            emergency.applyUpdate(update);
            details = emergency.toDetails();
        }

        publisher.emergencyUpdated(emergencyId, details);

        return details;



    }





}
