package com.sewa.dto.request;

import com.sewa.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeRequest {
    @NotNull(message = "Member ID is required")
    private Integer memberId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Fee date is required")
    private LocalDate feeDate;

    private String transactionId;
    private PaymentStatus status;
}
