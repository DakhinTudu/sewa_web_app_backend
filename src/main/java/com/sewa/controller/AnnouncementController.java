package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.AnnouncementRequest;
import com.sewa.dto.response.AnnouncementResponse;
import com.sewa.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcements", description = "In-app announcements and notifications")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    @PreAuthorize("hasAuthority('ANNOUNCEMENT_VIEW') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "List announcements", description = "Get announcements for the current user with read status")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> list(Principal principal) {
        List<AnnouncementResponse> list = announcementService.listForCurrentUser(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Announcements fetched"));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasAuthority('ANNOUNCEMENT_VIEW') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Unread count", description = "Get count of unread announcements for the bell badge")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> unreadCount(Principal principal) {
        int count = announcementService.getUnreadCount(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(Map.of("unreadCount", count), "Unread count fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ANNOUNCEMENT_CREATE') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Create announcement", description = "Post a new announcement (admin only)")
    public ResponseEntity<ApiResponse<Void>> create(
            @Valid @RequestBody AnnouncementRequest request,
            Principal principal) {
        announcementService.create(request, principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Announcement created"));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAuthority('ANNOUNCEMENT_VIEW') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Mark as read", description = "Mark an announcement as read for the current user")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Integer id, Principal principal) {
        announcementService.markAsRead(id, principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Marked as read"));
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasAuthority('ANNOUNCEMENT_VIEW') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Mark all as read", description = "Mark all visible announcements as read for the current user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Principal principal) {
        announcementService.markAllAsRead(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "All announcements marked as read"));
    }
}
