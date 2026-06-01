package com.example.ordersystem.exception;
import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends CustomException {
    public ProductNotFoundException(String msg) { super(msg); }
    @Override public HttpStatus getHttpStatus() { return HttpStatus.NOT_FOUND; }
}