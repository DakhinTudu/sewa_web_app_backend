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
    private Long totalMembers;
    private java.util.List<ExecutiveResponse> representatives;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class ExecutiveResponse {
        private String memberName;
        private String membershipCode;
        private String role;
    }
}
