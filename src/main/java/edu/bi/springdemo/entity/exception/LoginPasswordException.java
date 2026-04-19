package edu.bi.springdemo.entity.exception;

public class LoginPasswordException extends RuntimeException {
    private LoginPasswordException(String message) {
        super(message);
    }
    public static LoginPasswordException create(String message){
        return new LoginPasswordException(message);
    }
}