package com.example.ordersystem.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateOrderItemRequestDto {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;
}