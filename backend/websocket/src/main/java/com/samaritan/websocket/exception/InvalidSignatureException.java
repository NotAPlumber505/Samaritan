package com.samaritan.websocket.exception;

public class InvalidSignatureException extends RuntimeException {

    public InvalidSignatureException(long userId) {
        super("Signature is invalid for user " + userId);
    }
}