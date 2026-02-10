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
    private BigDecimal amount;
    private LocalDate feeDate;
    private String transactionId;
    private PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
