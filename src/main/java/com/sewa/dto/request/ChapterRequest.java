package com.sewa.dto.request;

import com.sewa.entity.enums.ChapterType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChapterRequest {
    @NotBlank(message = "Chapter name is required")
    private String chapterName;

    @NotBlank(message = "Location is required")
    private String location;

    private ChapterType chapterType;
}
