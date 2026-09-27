package com.samaritan.websocket.service;

@org.springframework.stereotype.Service
public class EmergencyPushService {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(EmergencyPushService.class);
    private static final double NEARBY_RADIUS_METERS = 2000;

    private final com.samaritan.websocket.repository.SamaritanLocationRepository locationRepository;
        private final org.springframework.beans.factory.ObjectProvider<com.google.firebase.messaging.FirebaseMessaging>
            messagingProvider;

    public EmergencyPushService(
            com.samaritan.websocket.repository.SamaritanLocationRepository locationRepository,
                org.springframework.beans.factory.ObjectProvider<com.google.firebase.messaging.FirebaseMessaging>
                    messagingProvider) {
        this.locationRepository = locationRepository;
        this.messagingProvider = messagingProvider;
    }

    public void notifyNearbySamaritans(long emergencyId, long requesterUserId,
                                       double latitude, double longitude) {
        try {
            com.google.firebase.messaging.FirebaseMessaging messaging = messagingProvider.getIfAvailable();
            if (messaging == null) {
            log.info("Push notifications are disabled; skipping emergency {}", emergencyId);
            return;
            }

            for (com.samaritan.websocket.model.SamaritanPushRecipient recipient
                : locationRepository.findNearbyRecipients(
                    requesterUserId, latitude, longitude, NEARBY_RADIUS_METERS)) {
            com.google.firebase.messaging.Message message = com.google.firebase.messaging.Message.builder()
                .setToken(recipient.pushToken())
                .setNotification(com.google.firebase.messaging.Notification.builder()
                    .setTitle("Emergency nearby")
                    .setBody("Someone needs help within 2 km. Tap to view nearby alerts.")
                    .build())
                .setAndroidConfig(com.google.firebase.messaging.AndroidConfig.builder()
                    .setPriority(com.google.firebase.messaging.AndroidConfig.Priority.HIGH)
                    .setNotification(com.google.firebase.messaging.AndroidNotification.builder()
                        .setChannelId("emergency-alerts")
                        .build())
                    .build())
                .putData("emergencyId", Long.toString(emergencyId))
                .putData("route", "/(tabs)/alerts")
                .build();
            try {
                messaging.send(message);
            } catch (com.google.firebase.messaging.FirebaseMessagingException exception) {
                log.warn("Could not send emergency {} notification to Samaritan {}: {}",
                    emergencyId, recipient.userId(), exception.getMessagingErrorCode());
            }
            }
        } catch (RuntimeException exception) {
            log.error("Push fan-out failed for emergency {}; the emergency was still created", emergencyId, exception);
        }
    }
}