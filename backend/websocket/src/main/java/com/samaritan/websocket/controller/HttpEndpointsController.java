package com.samaritan.websocket.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.samaritan.constants.api.CreateEmergencyResponse;
import com.samaritan.constants.api.CreateEmergency;
import com.samaritan.utils.repositories.EmergencyTable;
@RestController
public class HttpEndpointsController {
    @PostMapping("/emergency")
    public ResponseEntity<CreateEmergencyResponse> postEmergency(@RequestBody CreateEmergency emergencyJSON) {
        int emergencyId = EmergencyTable.insertEmergency(emergencyJSON);
        CreateEmergencyResponse response = new CreateEmergencyResponse(emergencyId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
