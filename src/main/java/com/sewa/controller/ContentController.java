package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.ContentRequest;
import com.sewa.dto.response.ContentResponse;
import com.sewa.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
@Tag(name = "Content Management", description = "APIs for managing website and portal content")
public class ContentController {

    private final ContentService contentService;

    @GetMapping
    @PreAuthorize("hasAuthority('CONTENT_VIEW')")
    @Operation(summary = "Get all content", description = "Fetch a paginated list of portal content")
    public ResponseEntity<ApiResponse<Page<ContentResponse>>> getAllContent(Pageable pageable) {
        Page<ContentResponse> content = contentService.getAllContent(pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(content, "Content fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CONTENT_CREATE')")
    @Operation(summary = "Create content", description = "Add new portal content (Admin only)")
    public ResponseEntity<ApiResponse<ContentResponse>> createContent(@Valid @RequestBody ContentRequest content) {
        ContentResponse created = contentService.createContent(content);
        return ResponseEntity.ok(ApiResponseBuilder.success(created, "Content created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_VIEW')")
    @Operation(summary = "Get content by ID")
    public ResponseEntity<ApiResponse<ContentResponse>> getContentById(@PathVariable Integer id) {
        ContentResponse content = contentService.getContentById(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(content, "Content fetched"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_UPDATE')")
    @Operation(summary = "Update content")
    public ResponseEntity<ApiResponse<ContentResponse>> updateContent(@PathVariable Integer id,
            @Valid @RequestBody ContentRequest content) {
        ContentResponse updated = contentService.updateContent(id, content);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "Content updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_DELETE')")
    @Operation(summary = "Soft delete content")
    public ResponseEntity<ApiResponse<Void>> deleteContent(@PathVariable Integer id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Content soft-deleted"));
    }

    @PostMapping(value = "/{id}/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('CONTENT_UPDATE')")
    @Operation(summary = "Upload file for content")
    public ResponseEntity<ApiResponse<ContentResponse>> uploadFile(@PathVariable Integer id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        ContentResponse updated = contentService.uploadFile(id, file);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "File uploaded"));
    }
}
