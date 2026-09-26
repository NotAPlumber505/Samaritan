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
        boolean result = Ecdsa.verifyECDSA(body.rawData().getBytes(StandardCharsets.UTF_8), body.signedData().getBytes(StandardCharsets.UTF_8), body.publicKey());
        if (result) {
            System.out.println("Succesful verification!");
        }
        else {
            System.out.println("Failed to verify! Oh no!");
        }
    }
}
