package com.samaritan.websocket.exception;

public class NotEmergencyOwnerException extends RuntimeException{

    public NotEmergencyOwnerException(long emergencyId) {
        super("Only the reporter can update emergency " + emergencyId);
    }


}
