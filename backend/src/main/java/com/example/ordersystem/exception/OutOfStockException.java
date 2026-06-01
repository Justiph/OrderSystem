package com.example.ordersystem.exception;
import org.springframework.http.HttpStatus;

public class OutOfStockException extends CustomException {
    public OutOfStockException(String msg) { super(msg); }
    @Override public HttpStatus getHttpStatus() { return HttpStatus.BAD_REQUEST; }
}