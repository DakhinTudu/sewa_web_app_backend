package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.MessageRequest;
import com.sewa.dto.response.MessageResponse;
import com.sewa.service.InternalMessageService;
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
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Messaging", description = "APIs for internal messaging between users")
public class MessagingController {

    private final InternalMessageService messageService;

    @GetMapping
    @PreAuthorize("hasAuthority('MESSAGE_VIEW')")
    @Operation(summary = "Get all messages", description = "Fetch all internal messages for the current user")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getAllMessages() {
        List<MessageResponse> messages = messageService.getAllMessages();
        return ResponseEntity.ok(ApiResponseBuilder.success(messages, "Messages fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MESSAGE_SEND')")
    @Operation(summary = "Send message", description = "Send a new internal message")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(Principal principal,
            @Valid @RequestBody MessageRequest message) {
        MessageResponse sent = messageService.sendMessage(principal.getName(), message);
        return ResponseEntity.ok(ApiResponseBuilder.success(sent, "Message sent"));
    }
}
