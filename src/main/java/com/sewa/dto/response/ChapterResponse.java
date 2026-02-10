package com.sewa.dto.response;

import com.sewa.entity.enums.ChapterType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChapterResponse {
    private Integer id;
    private String chapterName;
    private String location;
    private ChapterType chapterType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
