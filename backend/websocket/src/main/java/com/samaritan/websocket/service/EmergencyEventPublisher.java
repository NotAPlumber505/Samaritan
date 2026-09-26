package com.samaritan.websocket.service;


import com.samaritan.websocket.model.event.EmergencyEvent;
import com.samaritan.websocket.model.event.EmergencyEventType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;



@Service
public class EmergencyEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EmergencyEventPublisher.class);

    private final SimpMessagingTemplate messagingTemplate;


    public EmergencyEventPublisher(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }

    public void emergencyUpdated(long emergencyId, Object details) {
        publish(emergencyId, EmergencyEventType.UPDATED, details);
    }

    public void emergencyAccepted(long emergencyId, long userId) {
        publish(emergencyId, EmergencyEventType.ACCEPTED, Map.of("User_ID", userId));
    }

    public void emergencyUnaccepted(long emergencyId, long userId) {
        publish(emergencyId, EmergencyEventType.UNACCEPTED, Map.of("User_ID", userId));
    }

    public void emergencyResolved(long emergencyId) {
        publish(emergencyId, EmergencyEventType.RESOLVED, null);
    }

    public void emergencyDeleted(long emergencyId) {
        publish(emergencyId, EmergencyEventType.DELETED, null);
    }

    static String topicFor(long emergencyId) {
        return "/topic/emergency/" + emergencyId;
    }

    private void publish(long emergencyId, EmergencyEventType type, Object data) {
        EmergencyEvent event = new EmergencyEvent(type, emergencyId, data, System.currentTimeMillis());
        messagingTemplate.convertAndSend(topicFor(emergencyId), event);
        log.info("Published {} for emergency {}", type, emergencyId);
    }

}
