package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.CommunicationRecipientRequest;
import com.sewa.dto.request.SendCommunicationRequest;
import com.sewa.dto.response.CommunicationLogResponse;
import com.sewa.dto.response.CommunicationPreviewResponse;
import com.sewa.dto.response.CommunicationReceivedResponse;
import com.sewa.service.CommunicationService;
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
@RequestMapping("/api/v1/communications")
@RequiredArgsConstructor
@Tag(name = "Communications", description = "Send custom emails to members")
public class CommunicationController {

    private final CommunicationService communicationService;

    @PostMapping("/preview")
    @PreAuthorize("hasAuthority('COMMUNICATIONS_SEND') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Preview recipients", description = "Get recipient count and sample emails for the given selection")
    public ResponseEntity<ApiResponse<CommunicationPreviewResponse>> preview(
            @Valid @RequestBody CommunicationRecipientRequest selection) {
        CommunicationPreviewResponse response = communicationService.preview(selection);
        return ResponseEntity.ok(ApiResponseBuilder.success(response, "Preview generated"));
    }

    @PostMapping("/send")
    @PreAuthorize("hasAuthority('COMMUNICATIONS_SEND') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Send email", description = "Send custom email to selected members")
    public ResponseEntity<ApiResponse<Void>> send(
            @Valid @RequestBody SendCommunicationRequest request,
            Principal principal) {
        communicationService.send(request, principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Emails sent successfully"));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAuthority('COMMUNICATIONS_SEND') or hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Get send history", description = "List recent communication logs")
    public ResponseEntity<ApiResponse<List<CommunicationLogResponse>>> getHistory() {
        List<CommunicationLogResponse> list = communicationService.getHistory();
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "History fetched"));
    }

    @GetMapping("/received-by-me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get communications sent to me", description = "List emails sent to the current user (for bell)")
    public ResponseEntity<ApiResponse<List<CommunicationReceivedResponse>>> getReceivedByMe(Principal principal) {
        List<CommunicationReceivedResponse> list = communicationService.getCommunicationsReceivedByMe(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(list, "Communications received"));
    }

    @GetMapping("/received-by-me/unread-count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Unread count of communications received", description = "For bell badge")
    public ResponseEntity<ApiResponse<java.util.Map<String, Integer>>> getReceivedUnreadCount(Principal principal) {
        int count = communicationService.getCommunicationsReceivedUnreadCount(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(java.util.Map.of("unreadCount", count), "Unread count"));
    }

    @PatchMapping("/received-by-me/{recipientId}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark received communication as read")
    public ResponseEntity<ApiResponse<Void>> markReceivedAsRead(@PathVariable Integer recipientId, Principal principal) {
        communicationService.markCommunicationReceivedAsRead(recipientId, principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Marked as read"));
    }
}
