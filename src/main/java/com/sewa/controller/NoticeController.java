package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.NoticeRequest;
import com.sewa.dto.response.NoticeResponse;
import com.sewa.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
@Tag(name = "Notice Management", description = "APIs for announcements and notices")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    @PreAuthorize("hasAuthority('CONTENT_VIEW')")
    @Operation(summary = "Get all notices", description = "Fetch a list of all active notices and announcements")
    public ResponseEntity<ApiResponse<List<NoticeResponse>>> getAllNotices() {
        List<NoticeResponse> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(ApiResponseBuilder.success(notices, "Notices fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CONTENT_CREATE')")
    @Operation(summary = "Create notice", description = "Post a new announcement (Admin only)")
    public ResponseEntity<ApiResponse<NoticeResponse>> createNotice(Principal principal,
            @Valid @RequestBody NoticeRequest notice) {
        NoticeResponse saved = noticeService.saveNotice(principal.getName(), notice);
        return ResponseEntity.ok(ApiResponseBuilder.success(saved, "Notice created"));
    }
}
