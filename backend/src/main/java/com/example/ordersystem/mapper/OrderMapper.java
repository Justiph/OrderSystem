package com.example.ordersystem.mapper;

import com.example.ordersystem.dto.*;
import com.example.ordersystem.entity.*;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public ProductResponseDto toProductResponse(Product product) {
        if (product == null) return null;
        ProductResponseDto response = new ProductResponseDto();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setImageUrl(product.getImageUrl());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    public OrderResponseDto toOrderResponse(Order order) {
        if (order == null) return null;
        OrderResponseDto response = new OrderResponseDto();
        response.setId(order.getId());
        response.setCustomerName(order.getCustomerName());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(order.getItems().stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public OrderItemResponseDto toOrderItemResponse(OrderItem item) {
        if (item == null) return null;
        OrderItemResponseDto response = new OrderItemResponseDto();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        return response;
    }
}