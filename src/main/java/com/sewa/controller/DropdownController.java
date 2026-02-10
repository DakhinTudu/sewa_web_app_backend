package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.response.DropdownResponse;
import com.sewa.entity.enums.*;
import com.sewa.repository.ChapterRepository;
import com.sewa.repository.PermissionRepository;
import com.sewa.repository.RoleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dropdowns")
@RequiredArgsConstructor
@Tag(name = "Dropdowns", description = "Endpoints for fetching key-value pairs for UI dropdowns")
public class DropdownController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ChapterRepository chapterRepository;

    @GetMapping("/roles")
    @Operation(summary = "Get roles")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getRoles() {
        List<DropdownResponse> list = roleRepository.findAll().stream()
                .map(role -> new DropdownResponse(role.getRoleName(), role.getRoleName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Roles fetched"));
    }

    @GetMapping("/chapters")
    @Operation(summary = "Get active chapters")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getChapters() {
        List<DropdownResponse> list = chapterRepository.findByIsDeletedFalse().stream()
                .map(c -> new DropdownResponse(c.getId().toString(), c.getChapterName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Chapters fetched"));
    }

    @GetMapping("/permissions")
    @Operation(summary = "Get permissions")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getPermissions() {
        List<DropdownResponse> list = permissionRepository.findAll().stream()
                .map(p -> new DropdownResponse(p.getPermissionCode(), p.getPermissionCode()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Permissions fetched"));
    }

    @GetMapping("/member-status")
    @Operation(summary = "Get membership statuses")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getMemberStatuses() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(MembershipStatus.values()), "Statuses fetched"));
    }

    @GetMapping("/student-status")
    @Operation(summary = "Get student statuses")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getStudentStatuses() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(MembershipStatus.values()), "Statuses fetched"));
    }

    @GetMapping("/chapter-types")
    @Operation(summary = "Get chapter types")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getChapterTypes() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(ChapterType.values()), "Chapter types fetched"));
    }

    @GetMapping("/content-types")
    @Operation(summary = "Get content types")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getContentTypes() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(ContentType.values()), "Content types fetched"));
    }

    @GetMapping("/visibility-types")
    @Operation(summary = "Get visibility types")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getVisibilityTypes() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(Visibility.values()), "Visibility types fetched"));
    }

    @GetMapping("/calendar-event-types")
    @Operation(summary = "Get calendar event types")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getCalendarEventTypes() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(CalendarEventType.values()), "Event types fetched"));
    }

    @GetMapping("/designations")
    @Operation(summary = "Get representative designations")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getDesignations() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(Designation.values()), "Designations fetched"));
    }

    @GetMapping("/payment-status")
    @Operation(summary = "Get payment statuses")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getPaymentStatuses() {
        return ResponseEntity
                .ok(ApiResponseBuilder.success(getEnumDropdown(PaymentStatus.values()), "Payment statuses fetched"));
    }

    @GetMapping("/genders")
    @Operation(summary = "Get genders")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getGenders() {
        return ResponseEntity.ok(ApiResponseBuilder.success(getEnumDropdown(Gender.values()), "Genders fetched"));
    }

    @GetMapping("/financial-years")
    @Operation(summary = "Get financial years")
    public ResponseEntity<ApiResponse<List<DropdownResponse>>> getFinancialYears() {
        // Logic for last 5 years and next 1 year
        int currentYear = java.time.LocalDate.now().getYear();
        List<DropdownResponse> list = new java.util.ArrayList<>();
        for (int i = currentYear - 5; i <= currentYear + 1; i++) {
            String year = i + "-" + ((i + 1) % 100);
            list.add(new DropdownResponse(year, year));
        }
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Financial years fetched"));
    }

    private List<DropdownResponse> getEnumDropdown(Enum<?>[] values) {
        return Arrays.stream(values)
                .map(e -> new DropdownResponse(e.name(), e.name()))
                .collect(Collectors.toList());
    }
}
