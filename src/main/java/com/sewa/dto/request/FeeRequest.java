package com.sewa.dto.request;

import com.sewa.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeRequest {
    /** Internal member ID (optional if membershipCode is provided) */
    private Integer memberId;

    /** Membership code for lookup (e.g. SEWAM001). Used when member is paying by code. */
    private String membershipCode;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    /** Fee/payment date. Defaults to today if not set. */
    private LocalDate feeDate;

    /** Financial year (e.g. 2024-25). Required when adding by membership code. */
    private String financialYear;

    /** Receipt or transaction reference. Stored as transactionId. */
    private String receiptNumber;

    private String remarks;

    /** Legacy: stored as transactionId if receiptNumber not set */
    private String transactionId;

    private PaymentStatus status;
}
