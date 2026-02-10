package com.sewa.dto.request;

import com.sewa.entity.enums.ContentType;
import com.sewa.entity.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ContentRequest {
    @NotNull(message = "Content type is required")
    private ContentType contentType;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private Visibility visibility;
    private LocalDate eventDate;
    private Boolean published;
}
