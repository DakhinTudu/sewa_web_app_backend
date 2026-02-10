package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.UserRepository;
import com.sewa.repository.StudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin Dashboard", description = "APIs for administrative statistics and overview")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard stats", description = "Fetch aggregate counts of users, members, and students")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalMembers", memberRepository.count());
        stats.put("totalStudents", studentRepository.count());

        return ResponseEntity.ok(ApiResponseBuilder.success(stats, "Dashboard statistics fetched"));
    }
}
