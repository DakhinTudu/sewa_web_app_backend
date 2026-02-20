package com.sewa.common.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardReportResponse {
    private long totalUsers;
    private long totalMembers;
    private long totalStudents;
    private long totalChapters;

    private Map<String, Long> membersByChapter;
    private Map<String, Long> studentsByChapter;
    private Map<String, Long> membersByEducationalLevel;
    private Map<String, Long> membersByWorkingSector;
    private Map<String, Long> studentsByEducationalLevel;
}
