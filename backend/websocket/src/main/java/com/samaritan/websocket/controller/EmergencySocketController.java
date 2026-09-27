package com.samaritan.websocket.controller;


import java.util.Map;

import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.service.EmergencyService;

@org.springframework.stereotype.Controller
public class EmergencySocketController {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(EmergencySocketController.class);

    private final EmergencyService emergencyService;

    public EmergencySocketController(EmergencyService emergencyService){
        this.emergencyService = emergencyService;
    }

    // client sends to /app/emergency/{id}/update
        @org.springframework.messaging.handler.annotation.MessageMapping("/emergency/{emergencyId}/update")
        @org.springframework.messaging.simp.annotation.SendToUser(
            destinations = "/queue/emergency-updates", broadcast = false)
        public Map<String, Object> updateEmergency(
            @org.springframework.messaging.handler.annotation.DestinationVariable long emergencyId,
            @org.springframework.messaging.handler.annotation.Payload
            com.samaritan.websocket.model.UpdateEmergencyMessage update) {
        emergencyService.applyUpdate(emergencyId, update);
        return Map.of("emergency_id", emergencyId, "status", "updated");
    }

        @org.springframework.messaging.handler.annotation.MessageExceptionHandler({
            EmergencyNotFoundException.class,
            NotEmergencyOwnerException.class,
            com.samaritan.websocket.exception.InvalidSignatureException.class
        })
        @org.springframework.messaging.simp.annotation.SendToUser(destinations = "/queue/errors", broadcast = false)
    public Map<String, String> handleError(RuntimeException ex) {
        return Map.of("error", ex.getMessage());
    }

    @org.springframework.messaging.handler.annotation.MessageExceptionHandler(Exception.class)
    @org.springframework.messaging.simp.annotation.SendToUser(destinations = "/queue/errors", broadcast = false)
    public Map<String, String> handleUnexpectedError(Exception exception) {
        log.error("Failed to process WebSocket emergency update", exception);
        return Map.of("error", "The server could not save the emergency update.");
    }


}
