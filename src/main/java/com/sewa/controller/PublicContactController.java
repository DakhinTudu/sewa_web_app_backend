package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.PublicContactRequest;
import com.sewa.dto.response.MessageResponse;
import com.sewa.service.InternalMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@Tag(name = "Public Contact", description = "Public endpoint for website contact form")
public class PublicContactController {

    private final InternalMessageService messageService;

    @PostMapping
    @Operation(summary = "Submit contact request", description = "Submit a public contact inquiry from website visitors")
    public ResponseEntity<ApiResponse<MessageResponse>> submitContact(@Valid @RequestBody PublicContactRequest request) {
        MessageResponse created = messageService.submitPublicContact(request);
        return ResponseEntity.ok(ApiResponseBuilder.success(created, "Contact request submitted"));
    }
}
