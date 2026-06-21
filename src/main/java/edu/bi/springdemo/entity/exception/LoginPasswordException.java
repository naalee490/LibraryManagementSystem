package edu.bi.springdemo.entity.exception;

public class LoginPasswordException extends RuntimeException {
    private LoginPasswordException(String message) {
        super(message);
    }
    // factory so we dont expose public constructor
    public static LoginPasswordException create(String message){
        return new LoginPasswordException(message);
    }
}