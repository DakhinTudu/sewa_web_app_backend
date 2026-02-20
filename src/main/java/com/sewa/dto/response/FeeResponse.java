package com.sewa.dto.response;

import com.sewa.entity.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class FeeResponse {
    private Integer id;
    private String memberName;
    private String membershipCode;
    private String financialYear;
    private BigDecimal amount;
    private LocalDate feeDate;
    /** Alias for frontend: same as feeDate */
    private LocalDate paymentDate;
    private String transactionId;
    /** Receipt number (alias for transactionId for frontend) */
    private String receiptNumber;
    private PaymentStatus status;
    /** Alias for frontend: same as status */
    private PaymentStatus paymentStatus;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
