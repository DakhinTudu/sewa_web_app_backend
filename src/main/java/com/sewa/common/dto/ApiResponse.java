package com.sewa.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private PaginatedResponse.PaginationMeta pageable; // For paginated endpoints
    private int status;
    private Instant timestamp;
}
