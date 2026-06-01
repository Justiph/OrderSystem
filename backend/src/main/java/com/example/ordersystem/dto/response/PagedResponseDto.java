package com.example.ordersystem.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class PagedResponseDto<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}