package com.samaritan.utils;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;

class SignaturePayloadsTest {

    @org.junit.jupiter.api.Test
    void createEmergencyPayloadMatchesFrontendFieldOrderAndNumbers() {
        org.junit.jupiter.api.Assertions.assertEquals(
                "{\"user_id\":7,\"latitude\":40.71,\"longitude\":-73.98}",
                SignaturePayloads.createEmergency(7, 40.71, -73.98));
    }

    @org.junit.jupiter.api.Test
    void updatePayloadMatchesFrontendFieldOrderAndJsonEscaping() {
        org.junit.jupiter.api.Assertions.assertEquals(
            "{\"user_id\":7,\"latitude\":40.71,\"longitude\":-73.98,\"requires_911\":true,\"emergency_nature\":\"medical\",\"self_emergency\":\"true\",\"description\":\"sharp \\\"pain\\\"\\nnow\"}",
                SignaturePayloads.websocketUpdate(7, 40.71, -73.98, true,
                        "medical", "true", "sharp \"pain\"\nnow"));
        org.junit.jupiter.api.Assertions.assertEquals(
                "{\"user_id\":7,\"emergency_id\":42,\"description\":\"details\"}",
                SignaturePayloads.updateEmergency(7, 42, null, null, null, null, null, "details"));
        org.junit.jupiter.api.Assertions.assertEquals(
            "{\"user_id\":7,\"emergency_id\":42,\"latitude\":40.71,\"longitude\":-73.98,\"requires_911\":true,\"emergency_nature\":\"medical\",\"self_emergency\":\"false\",\"description\":\"details\"}",
            SignaturePayloads.updateEmergency(7, 42, 40.71, -73.98, true,
                "medical", "false", "details"));
    }

    @org.junit.jupiter.api.Test
    void verifierAcceptsMatchingSignatureAndRejectsInvalidInput() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
        generator.initialize(new ECGenParameterSpec("secp256r1"));
        KeyPair keyPair = generator.generateKeyPair();
        String payload = SignaturePayloads.emergencyAction(7, 42);

        Signature signer = Signature.getInstance("SHA256withECDSA");
        signer.initSign(keyPair.getPrivate());
        signer.update(payload.getBytes(StandardCharsets.UTF_8));
        String signature = Base64.getEncoder().encodeToString(signer.sign());
        String publicKey = "-----BEGIN PUBLIC KEY-----\n"
                + Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded())
                + "\n-----END PUBLIC KEY-----";

        org.junit.jupiter.api.Assertions.assertTrue(Ecdsa.verifyECDSA(payload, signature, publicKey));
        org.junit.jupiter.api.Assertions.assertFalse(Ecdsa.verifyECDSA(payload + " ", signature, publicKey));
        org.junit.jupiter.api.Assertions.assertFalse(Ecdsa.verifyECDSA(payload, "not-base64", publicKey));
    }
}