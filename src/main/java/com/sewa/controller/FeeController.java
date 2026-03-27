package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.dto.PageDto;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.FeeRequest;
import com.sewa.dto.response.FeeResponse;
import com.sewa.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
@Tag(name = "Fee Management", description = "APIs for membership fees and financial records")
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    @PreAuthorize("hasAuthority('FEE_VIEW')")
    @Operation(summary = "Get all fee records (paginated)", description = "Fetch all membership fee records for admin/reporting")
    public ResponseEntity<ApiResponse<PageDto<FeeResponse>>> getAllFees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) com.sewa.entity.enums.PaymentStatus status,
            @RequestParam(required = false) String year,
            Pageable pageable) {
        Page<FeeResponse> page = (query != null && !query.isBlank()) || status != null
                || (year != null && !year.isBlank())
                        ? feeService.searchFees(query, status, year, pageable)
                        : feeService.getAllFees(pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(
                PageDto.from(page), "Fees fetched successfully"));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAuthority('FEE_VIEW')")
    @Operation(summary = "Get fees by member ID (Internal)", description = "Fetch all fee records for a member using internal ID")
    public ResponseEntity<ApiResponse<List<FeeResponse>>> getMemberFees(@PathVariable Integer memberId) {
        List<FeeResponse> fees = feeService.getFeesByMember(memberId);
        return ResponseEntity.ok(ApiResponseBuilder.success(fees, "Fees fetched successfully"));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('FEE_VIEW')")
    @Operation(summary = "Get fees by membership code", description = "Fetch all fee records for a member using their public membership code")
    public ResponseEntity<ApiResponse<List<FeeResponse>>> getMemberFeesByCode(@PathVariable String code) {
        List<FeeResponse> fees = feeService.getFeesByMemberCode(code);
        return ResponseEntity.ok(ApiResponseBuilder.success(fees, "Fees fetched successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('FEE_PAY')")
    @Operation(summary = "Add fee record", description = "Create a new membership fee record")
    public ResponseEntity<ApiResponse<FeeResponse>> addFee(@Valid @RequestBody FeeRequest fee) {
        FeeResponse saved = feeService.saveFee(fee);
        return ResponseEntity.ok(ApiResponseBuilder.success(saved, "Fee record added"));
    }

    @PostMapping("/submit")
    @PreAuthorize("hasAuthority('FEE_PAY')")
    @Operation(summary = "Submit payment for approval", description = "Users submit their payment details and screenshot for admin approval")
    public ResponseEntity<ApiResponse<FeeResponse>> submitPayment(@Valid @RequestBody FeeRequest fee) {
        fee.setStatus(com.sewa.entity.enums.PaymentStatus.PENDING);
        FeeResponse saved = feeService.saveFee(fee);
        return ResponseEntity.ok(ApiResponseBuilder.success(saved, "Payment submitted for approval"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get pending payments", description = "Fetch all payments awaiting approval")
    public ResponseEntity<ApiResponse<PageDto<FeeResponse>>> getPendingPayments(Pageable pageable) {
        Page<FeeResponse> page = feeService.getPendingPayments(pageable);
        return ResponseEntity.ok(ApiResponseBuilder.success(PageDto.from(page), "Pending payments fetched"));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Approve payment", description = "Approve a pending payment and mark it as PAID")
    public ResponseEntity<ApiResponse<FeeResponse>> approvePayment(@PathVariable Integer id) {
        FeeResponse updated = feeService.approveFee(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "Payment approved"));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Reject payment", description = "Reject a pending payment")
    public ResponseEntity<ApiResponse<FeeResponse>> rejectPayment(@PathVariable Integer id, @RequestParam String reason) {
        FeeResponse updated = feeService.rejectFee(id, reason);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "Payment rejected"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update fee record", description = "Update an existing membership fee record")
    public ResponseEntity<ApiResponse<FeeResponse>> updateFee(@PathVariable Integer id,
            @Valid @RequestBody FeeRequest fee) {
        FeeResponse updated = feeService.updateFee(id, fee);
        return ResponseEntity.ok(ApiResponseBuilder.success(updated, "Fee record updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete fee record", description = "Permanently delete a fee record")
    public ResponseEntity<ApiResponse<Void>> deleteFee(@PathVariable Integer id) {
        feeService.deleteFee(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Fee record deleted"));
    }
}
