package com.samaritan.websocket.config;

@org.springframework.context.annotation.Configuration(proxyBeanMethods = false)
public class FirebaseMessagingConfiguration {

    @org.springframework.context.annotation.Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(
        name = "samaritan.firebase.enabled", havingValue = "true")
    public com.google.firebase.messaging.FirebaseMessaging samaritanFirebaseMessaging(
        @org.springframework.beans.factory.annotation.Value("${samaritan.firebase.project-id:}") String projectId)
        throws java.io.IOException {
        if (projectId.isBlank()) {
            throw new IllegalStateException("Set FIREBASE_PROJECT_ID when SAMARITAN_FIREBASE_ENABLED is true.");
        }
        com.google.firebase.FirebaseOptions options = com.google.firebase.FirebaseOptions.builder()
            .setCredentials(com.google.auth.oauth2.GoogleCredentials.getApplicationDefault())
                .setProjectId(projectId)
                .build();
        com.google.firebase.FirebaseApp app =
            com.google.firebase.FirebaseApp.initializeApp(options, "samaritan-push");
        return com.google.firebase.messaging.FirebaseMessaging.getInstance(app);
    }
}