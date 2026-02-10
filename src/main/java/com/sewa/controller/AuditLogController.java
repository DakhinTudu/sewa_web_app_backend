package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.entity.AuditLog;
import com.sewa.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "Audit Logs", description = "APIs for viewing system activity and security logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @Operation(summary = "Get all audit logs", description = "Fetch a paginated list of system activity logs (Super Admin only)")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAllLogs(Pageable pageable) {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(auditLogRepository.findAll(pageable), "Audit logs fetched"));
    }
}
