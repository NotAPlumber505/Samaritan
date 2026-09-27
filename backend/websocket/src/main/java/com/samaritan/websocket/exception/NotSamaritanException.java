package com.samaritan.websocket.exception;

public class NotSamaritanException extends RuntimeException {

    public NotSamaritanException(long userId) {
        super("User " + userId + " is not opted in as a Samaritan");
    }
}