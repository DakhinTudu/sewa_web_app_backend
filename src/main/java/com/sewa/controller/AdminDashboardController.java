package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.common.dto.DashboardReportResponse;
import com.sewa.repository.ChapterRepository;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.UserRepository;
import com.sewa.repository.StudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
// @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin Dashboard", description = "APIs for administrative statistics and overview")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final StudentRepository studentRepository;
    private final ChapterRepository chapterRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get detailed dashboard stats", description = "Fetch aggregate counts and grouped distributions")
    public ResponseEntity<ApiResponse<DashboardReportResponse>> getStats() {
        DashboardReportResponse stats = DashboardReportResponse.builder()
                .totalUsers(userRepository.count())
                .totalMembers(memberRepository.countActiveMembers())
                .totalStudents(studentRepository.count())
                .totalChapters(chapterRepository.count())
                .membersByChapter(mapGroupedResult(memberRepository.countMembersByChapter()))
                .studentsByChapter(mapGroupedResult(studentRepository.countStudentsByChapter()))
                .membersByEducationalLevel(mapGroupedResult(memberRepository.countMembersByEducationalLevel()))
                .membersByWorkingSector(mapGroupedResult(memberRepository.countMembersByWorkingSector()))
                .studentsByEducationalLevel(mapGroupedResult(studentRepository.countStudentsByEducationalLevel()))
                .build();

        return ResponseEntity.ok(ApiResponseBuilder.success(stats, "Dashboard statistics fetched"));
    }

    private Map<String, Long> mapGroupedResult(List<Object[]> results) {
        return results.stream()
                .filter(res -> res[0] != null)
                .collect(Collectors.toMap(
                        res -> res[0].toString(),
                        res -> (Long) res[1],
                        (existing, replacement) -> existing));
    }
}
