package com.samaritan.websocket.exception;

public class EmergencyNotFoundException extends RuntimeException{

    public EmergencyNotFoundException(long emergencyId){
        super("Emergency " + emergencyId + " not found");
    }


}
