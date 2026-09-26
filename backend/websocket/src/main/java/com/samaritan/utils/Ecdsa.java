package com.samaritan.utils;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class Ecdsa {
    public static boolean verifyECDSA(String rawData, String signedData, String publicKey) {
        byte[] byteRawData = rawData.getBytes(StandardCharsets.UTF_8);
        byte[] decodedSignedData = Base64.getDecoder().decode(signedData);
        String cleanKey = publicKey.replace("-----BEGIN PUBLIC KEY-----","")
                .replace("-----END PUBLIC KEY-----","")
                .replaceAll("[^a-zA-Z0-9+/=]", "");
        byte[] spkiEncodedBytes = Base64.getDecoder().decode(cleanKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(spkiEncodedBytes);
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            PublicKey decodedPublicKey = keyFactory.generatePublic(keySpec);
            Signature verifier = Signature.getInstance("SHA256withECDSA");
            verifier.initVerify(decodedPublicKey);
            verifier.update(byteRawData);
            return verifier.verify(decodedSignedData);
        }
        catch (Exception e) {
            System.out.println("Exception occurred when verifying key! Error: " + e );
        }
        System.out.println("Seems like verifying method had failed.");
        return false;
    }
}
