package com.example.ordersystem.exception;

import org.springframework.http.HttpStatus;

public abstract class CustomException extends RuntimeException {
    public CustomException(String message) { super(message); }
    public abstract HttpStatus getHttpStatus();
}