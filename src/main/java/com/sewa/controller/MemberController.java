package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.response.MemberResponse;
import com.sewa.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
@Tag(name = "Member Management", description = "APIs for association member operations")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/self")
    @PreAuthorize("hasAuthority('USER_PROFILE_VIEW')")
    @Operation(summary = "Get own profile", description = "Fetch the currently logged-in member's profile")
    public ResponseEntity<ApiResponse<MemberResponse>> getSelfProfile(Principal principal) {
        MemberResponse member = memberService.getMemberByUsername(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Profile fetched successfully"));
    }

    @PutMapping("/self")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    @Operation(summary = "Update own profile")
    public ResponseEntity<ApiResponse<MemberResponse>> updateSelf(Principal principal,
            @RequestBody MemberResponse request) {
        MemberResponse current = memberService.getMemberByUsername(principal.getName());
        MemberResponse member = memberService.updateMember(current.getId(), request);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Profile updated"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MEMBER_VIEW')")
    @Operation(summary = "Get member by ID")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberById(@PathVariable Integer id) {
        MemberResponse member = memberService.getMemberById(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Member fetched"));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('MEMBER_VIEW')")
    @Operation(summary = "Get member by code", description = "Fetch a member's profile by their membership code")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberByCode(@PathVariable String code) {
        MemberResponse member = memberService.getMemberByCode(code);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Member fetched successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MEMBER_LIST')")
    @Operation(summary = "Get all members", description = "Fetch a paginated list of all members")
    public ResponseEntity<ApiResponse<Page<MemberResponse>>> getAllMembers(Pageable pageable) {
        Page<MemberResponse> members = memberService.getAllMembers(pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(members, "Members list fetched"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('MEMBER_LIST')")
    @Operation(summary = "Get pending members")
    public ResponseEntity<ApiResponse<Page<MemberResponse>>> getPendingMembers(Pageable pageable) {
        // Implementation might need a specific service method, but for now we can
        // filter by status
        // TODO: Update service to support status filtering in getAllMembers
        return ResponseEntity
                .ok(ApiResponseBuilder.success(memberService.getAllMembers(pageable), "Pending members fetched"));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('MEMBER_APPROVE')")
    @Operation(summary = "Approve member", description = "Approve a pending member and generate membership code")
    public ResponseEntity<ApiResponse<MemberResponse>> approveMember(@PathVariable Integer id) {
        MemberResponse member = memberService.approveMember(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Member approved"));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('MEMBER_REJECT')")
    @Operation(summary = "Reject member")
    public ResponseEntity<ApiResponse<MemberResponse>> rejectMember(@PathVariable Integer id) {
        MemberResponse member = memberService.rejectMember(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Member rejected"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('MEMBER_UPDATE')")
    @Operation(summary = "Update member status")
    public ResponseEntity<ApiResponse<MemberResponse>> updateStatus(@PathVariable Integer id,
            @RequestParam String status) {
        MemberResponse member = memberService.updateMemberStatus(id, status);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Status updated"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MEMBER_UPDATE')")
    @Operation(summary = "Update member details")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMember(@PathVariable Integer id,
            @RequestBody MemberResponse request) {
        MemberResponse member = memberService.updateMember(id, request);
        return ResponseEntity.ok(ApiResponseBuilder.success(member, "Member updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MEMBER_DELETE')")
    @Operation(summary = "Soft delete member")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Integer id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Member soft-deleted"));
    }

    @GetMapping("/chapter/{chapterId}")
    @PreAuthorize("hasAuthority('MEMBER_LIST')")
    @Operation(summary = "Get members by chapter")
    public ResponseEntity<ApiResponse<Page<MemberResponse>>> getByChapter(@PathVariable Integer chapterId,
            Pageable pageable) {
        Page<MemberResponse> members = memberService.getMembersByChapter(chapterId, pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(members, "Chapter members fetched"));
    }

    @GetMapping("/chapter/{chapterId}/active")
    @PreAuthorize("hasAuthority('MEMBER_LIST')")
    @Operation(summary = "Get active members by chapter")
    public ResponseEntity<ApiResponse<Page<MemberResponse>>> getActiveByChapter(@PathVariable Integer chapterId,
            Pageable pageable) {
        Page<MemberResponse> members = memberService.getMembersByChapterAndStatus(chapterId, "ACTIVE", pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(members, "Active chapter members fetched"));
    }
}
