package com.samaritan.websocket.controller;


import com.samaritan.constants.api.test.ECDSATest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.samaritan.utils.Ecdsa;

import java.nio.charset.StandardCharsets;

@RestController
public class TestEDCSAKeyController {

    @PostMapping("/verify")
    public static void keyVerify(@RequestBody ECDSATest body) {
        System.out.println("Received Key! Body (JSON):\n " + body);
        System.out.println("Attempting to verify...");
        System.out.println("Public Key: " + body.publicKey());
        boolean result = Ecdsa.verifyECDSA(body.rawData(), body.signedData(), body.publicKey());
        if (result) {
            System.out.println("Succesful verification!");
        }
        else {
            System.out.println("Failed to verify! Oh no!");
        }
    }
}
