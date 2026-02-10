package com.sewa.dto.request;

import com.sewa.entity.enums.Priority;
import com.sewa.entity.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Content is required")
    private String content;

    private Priority priority;
    private Visibility visibility;
    private LocalDateTime expiresAt;
}
