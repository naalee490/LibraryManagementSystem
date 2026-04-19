package edu.bi.springdemo.controller;

import edu.bi.springdemo.entity.exception.BadRequestException;
import edu.bi.springdemo.entity.exception.LoginPasswordException;
import edu.bi.springdemo.entity.exception.ResourceAlreadyExistsException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Hidden
@RestControllerAdvice
public class GlobalExceptionController {

    private Map<String, String> buildErrorResponse(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        map.put("timestamp", new Date().toString());
        return map;
    }

    @ExceptionHandler(LoginPasswordException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED) //401
    public Map<String, String> handleLoginPasswordException(LoginPasswordException e) {
        return buildErrorResponse(e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException e) {
        return buildErrorResponse(e.getMessage());
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT) //409
    public Map<String, String> handleResourceAlreadyExistsException(ResourceAlreadyExistsException e) {
        return buildErrorResponse(e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) //400
    public Map<String, String> handleBadRequestException(BadRequestException e) {
        return buildErrorResponse(e.getMessage());
    }

    @ExceptionHandler(IllegalAccessException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN) //403
    public Map<String, String> handleIllegalAccessException(IllegalAccessException e) {
        return buildErrorResponse(e.getMessage());
    }
}