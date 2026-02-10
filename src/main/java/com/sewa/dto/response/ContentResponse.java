package com.sewa.dto.response;

import com.sewa.entity.enums.ContentType;
import com.sewa.entity.enums.Visibility;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ContentResponse {
    private Integer id;
    private ContentType contentType;
    private String title;
    private String description;
    private Visibility visibility;
    private LocalDate eventDate;
    private String authorName;
    private Boolean published;
    private String fileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
