package com.samaritan.utils;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class Ecdsa {
    public static boolean verifyECDSA(byte[] rawData, byte[] signedData, String publicKey) {
        String cleanKey = publicKey.replace("-----BEGIN PUBLIC KEY-----","")
                .replace("-----END PUBLIC KEY-----","")
                .replaceAll("\\S","");
        byte[] spkiEncodedBytes = Base64.getDecoder().decode(cleanKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(spkiEncodedBytes);
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            PublicKey decodedPublicKey = keyFactory.generatePublic(keySpec);
            Signature verifier = Signature.getInstance("SHA256withECDSA");
            verifier.initVerify(decodedPublicKey);
            verifier.update(rawData);
            return verifier.verify(signedData);
        }
        catch (Exception e) {
            System.out.println("Exception occurred when verifying key! Error: " + e );
        }
        return false;
    }
}
