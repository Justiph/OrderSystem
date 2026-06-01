package com.example.ordersystem.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequestDto {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotEmpty(message = "Order must contain at least one item")
    private List<CreateOrderItemRequestDto> items;
}