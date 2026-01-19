package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "membership_fees")
@Data
public class MembershipFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "financial_year", nullable = false)
    private String financialYear;

    private BigDecimal amount;
    private String paymentStatus;
    private LocalDate paymentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
