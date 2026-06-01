package com.example.ordersystem.exception;
import org.springframework.http.HttpStatus;

public class OrderNotFoundException extends CustomException {
    public OrderNotFoundException(String msg) { super(msg); }
    @Override public HttpStatus getHttpStatus() { return HttpStatus.NOT_FOUND; }
}