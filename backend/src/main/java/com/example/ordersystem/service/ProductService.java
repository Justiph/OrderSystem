package com.example.ordersystem.service;

import com.example.ordersystem.dto.ProductResponseDto;
import com.example.ordersystem.dto.request.CreateProductRequestDto;
import com.example.ordersystem.dto.request.UpdateProductRequestDto;
import com.example.ordersystem.dto.response.PagedResponseDto;
import com.example.ordersystem.entity.Product;
import com.example.ordersystem.exception.ProductNotFoundException;
import com.example.ordersystem.mapper.OrderMapper;
import com.example.ordersystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderMapper mapper;

    @Transactional(readOnly = true)
    public PagedResponseDto<ProductResponseDto> getAllProducts(String keyword, Pageable pageable) {
        Page<Product> productPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            productPage = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        PagedResponseDto<ProductResponseDto> response = new PagedResponseDto<>();
        response.setContent(productPage.getContent().stream().map(mapper::toProductResponse).toList());
        response.setPage(productPage.getNumber());
        response.setSize(productPage.getSize());
        response.setTotalElements(productPage.getTotalElements());
        response.setTotalPages(productPage.getTotalPages());
        return response;
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return mapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponseDto createProduct(CreateProductRequestDto request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();
        return mapper.toProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, UpdateProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());

        return mapper.toProductResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}