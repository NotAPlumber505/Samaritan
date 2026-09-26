package com.samaritan.websocket.controller;


import com.samaritan.websocket.exception.EmergencyNotFoundException;
import com.samaritan.websocket.exception.NotEmergencyOwnerException;
import com.samaritan.websocket.model.UpdateEmergencyMessage;
import com.samaritan.websocket.service.EmergencyService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class EmergencySocketController {

    private final EmergencyService emergencyService;

    public EmergencySocketController(EmergencyService emergencyService){
        this.emergencyService = emergencyService;
    }

    // client sends to /app/emergency/{id}/update
    @MessageMapping("/emergency/{emergencyId}/update")
    public void updateEmergency(@DestinationVariable long emergencyId,
                                 @Payload UpdateEmergencyMessage update){
        emergencyService.applyUpdate(emergencyId, update);
    }

    @MessageExceptionHandler({EmergencyNotFoundException.class, NotEmergencyOwnerException.class})
    @SendToUser(destinations = "/queue/errors", broadcast = false)
    public Map<String, String> handleError(RuntimeException ex) {
        return Map.of("Error", ex.getMessage());
    }


}
