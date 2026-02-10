package com.sewa.dto.response;

import com.sewa.entity.enums.Priority;
import com.sewa.entity.enums.Visibility;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private Integer id;
    private String senderName;
    private String subject;
    private String content;
    private Priority priority;
    private Visibility visibility;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
