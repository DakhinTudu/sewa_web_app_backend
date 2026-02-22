package com.sewa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementResponse {

    private Integer id;
    private String title;
    private String content;
    private Integer createdByUserId;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private boolean read;
}
