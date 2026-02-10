package com.sewa.common.util;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.dto.PaginatedResponse;
import org.springframework.http.HttpStatus;

import java.time.Instant;

public class ApiResponseBuilder {

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .status(HttpStatus.OK.value())
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message, PaginatedResponse.PaginationMeta meta) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pageable(meta)
                .status(HttpStatus.OK.value())
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, HttpStatus status) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .status(status.value())
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, HttpStatus status, T data) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(data)
                .status(status.value())
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, int status) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .status(status)
                .timestamp(Instant.now())
                .build();
    }
}
