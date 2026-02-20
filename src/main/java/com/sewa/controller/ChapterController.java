package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.dto.PageDto;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.ChapterRequest;
import com.sewa.dto.response.ChapterResponse;
import com.sewa.service.ChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chapters")
@RequiredArgsConstructor
@Tag(name = "Chapter Management", description = "APIs for association chapters")
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping
    @Operation(summary = "Get all chapters", description = "Fetch a paginated list of all association chapters")
    public ResponseEntity<ApiResponse<PageDto<ChapterResponse>>> getAllChapters(Pageable pageable) {
        return ResponseEntity.ok(ApiResponseBuilder.success(
                PageDto.from(chapterService.getAllChapters(pageable)), "Chapters fetched"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get chapter by ID")
    public ResponseEntity<ApiResponse<ChapterResponse>> getChapterById(@PathVariable Integer id) {
        ChapterResponse chapter = chapterService.getChapterById(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(chapter, "Chapter fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CHAPTER_CREATE')")
    @Operation(summary = "Create chapter", description = "Add a new association chapter (Admin only)")
    public ResponseEntity<ApiResponse<ChapterResponse>> createChapter(@Valid @RequestBody ChapterRequest chapter) {
        ChapterResponse created = chapterService.createChapter(chapter);
        return ResponseEntity.ok(ApiResponseBuilder.success(created, "Chapter created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Update chapter", description = "Update an existing association chapter (Admin only)")
    public ResponseEntity<ApiResponse<ChapterResponse>> updateChapter(@PathVariable Integer id,
            @Valid @RequestBody ChapterRequest chapter) {
        ChapterResponse updated = chapterService.updateChapter(id, chapter);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "Chapter updated"));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Activate chapter")
    public ResponseEntity<ApiResponse<ChapterResponse>> activateChapter(@PathVariable Integer id) {
        ChapterResponse activated = chapterService.activateChapter(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(activated, "Chapter activated"));
    }

    @PostMapping("/{chapterId}/members/{memberId}")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Assign member to chapter")
    public ResponseEntity<ApiResponse<Void>> assignMember(@PathVariable Integer chapterId,
            @PathVariable Integer memberId, @RequestParam String role) {
        chapterService.assignMember(chapterId, memberId, role);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Member assigned to chapter"));
    }

    @PatchMapping("/{chapterId}/members/{memberId}/role")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Update member role in chapter")
    public ResponseEntity<ApiResponse<Void>> updateMemberRole(@PathVariable Integer chapterId,
            @PathVariable Integer memberId, @RequestParam String role) {
        chapterService.updateMemberRole(chapterId, memberId, role);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Member role updated"));
    }

    @DeleteMapping("/{chapterId}/members/{memberId}")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Remove member from chapter")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable Integer chapterId,
            @PathVariable Integer memberId) {
        chapterService.removeMember(chapterId, memberId);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Member removed from chapter"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CHAPTER_UPDATE')")
    @Operation(summary = "Delete chapter", description = "Soft-delete an association chapter")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(@PathVariable Integer id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Chapter deleted"));
    }
}
