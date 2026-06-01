package com.example.ordersystem.service;

import com.example.ordersystem.dto.OrderResponseDto;
import com.example.ordersystem.dto.request.CreateOrderItemRequestDto;
import com.example.ordersystem.dto.request.CreateOrderRequestDto;
import com.example.ordersystem.entity.*;
import com.example.ordersystem.exception.OrderNotFoundException;
import com.example.ordersystem.exception.OutOfStockException;
import com.example.ordersystem.exception.ProductNotFoundException;
import com.example.ordersystem.mapper.OrderMapper;
import com.example.ordersystem.repository.OrderRepository;
import com.example.ordersystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper mapper;

    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequestDto request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .status(OrderStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .build();

        BigDecimal calculatedTotalPrice = BigDecimal.ZERO;

        for (CreateOrderItemRequestDto itemRequest : request.getItems()) {
            // 1. Validate all products exist
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + itemRequest.getProductId()));

            // 2. Validate stock is sufficient
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new OutOfStockException("Product '" + product.getName() + "' is out of stock. Requested: "
                        + itemRequest.getQuantity() + ", Available: " + product.getStock());
            }

            // 3. Deduct product stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            // 4. Create and add OrderItems with historical price point mapping
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.addOrderItem(orderItem);

            // 5. Calculate running total price
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            calculatedTotalPrice = calculatedTotalPrice.add(itemTotal);
        }

        order.setTotalPrice(calculatedTotalPrice);
        order.setStatus(OrderStatus.CONFIRMED); // Self-fulfilled processing confirmation post stock validation

        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(mapper::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        return mapper.toOrderResponse(order);
    }
}