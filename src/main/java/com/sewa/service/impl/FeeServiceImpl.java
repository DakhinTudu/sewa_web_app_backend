package com.sewa.service.impl;

import com.sewa.dto.request.FeeRequest;
import com.sewa.dto.response.FeeResponse;
import com.sewa.entity.Member;
import com.sewa.entity.MembershipFee;
import com.sewa.exception.SewaException;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.MembershipFeeRepository;
import com.sewa.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {

    private final MembershipFeeRepository feeRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<FeeResponse> getFeesByMember(Integer memberId) {
        return feeRepository.findByMemberId(memberId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeeResponse> getFeesByMemberCode(String code) {
        return feeRepository.findByMemberMembershipCode(code).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<FeeResponse> getAllFees(Pageable pageable) {
        return feeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<FeeResponse> searchFees(String query, com.sewa.entity.enums.PaymentStatus status, String year,
            Pageable pageable) {
        return feeRepository.searchFees(query, status, year, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public FeeResponse saveFee(FeeRequest feeRequest) {
        Member member;
        if (feeRequest.getMembershipCode() != null && !feeRequest.getMembershipCode().isBlank()) {
            member = memberRepository.findByMembershipCode(feeRequest.getMembershipCode())
                    .orElseThrow(
                            () -> new SewaException("Member not found with code: " + feeRequest.getMembershipCode()));
        } else if (feeRequest.getMemberId() != null) {
            Integer memberId = feeRequest.getMemberId();
            if (memberId == null) {
                throw new SewaException("Member ID cannot be null");
            }
            member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new SewaException("Member not found"));
        } else {
            throw new SewaException("Either memberId or membershipCode is required");
        }

        String financialYear = feeRequest.getFinancialYear() != null ? feeRequest.getFinancialYear() : "";
        java.time.LocalDate paymentDate = feeRequest.getFeeDate() != null ? feeRequest.getFeeDate()
                : java.time.LocalDate.now();
        String receiptOrTx = feeRequest.getReceiptNumber() != null ? feeRequest.getReceiptNumber()
                : (feeRequest.getTransactionId() != null ? feeRequest.getTransactionId() : "");
        com.sewa.entity.enums.PaymentStatus status = feeRequest.getStatus() != null ? feeRequest.getStatus()
                : com.sewa.entity.enums.PaymentStatus.PAID;

        MembershipFee fee = MembershipFee.builder()
                .member(member)
                .amount(feeRequest.getAmount())
                .paymentDate(paymentDate)
                .transactionId(receiptOrTx)
                .paymentStatus(status)
                .financialYear(financialYear)
                .remarks(feeRequest.getRemarks())
                .build();

        MembershipFee savedFee = java.util.Objects.requireNonNull(feeRepository.save(fee));
        return mapToResponse(savedFee);
    }

    @Override
    @Transactional
    public FeeResponse updateFee(Integer id, FeeRequest feeRequest) {
        if (id == null)
            throw new IllegalArgumentException("ID cannot be null");
        MembershipFee fee = feeRepository.findById(id)
                .orElseThrow(() -> new SewaException("Fee record not found"));

        if (feeRequest.getAmount() != null)
            fee.setAmount(feeRequest.getAmount());
        if (feeRequest.getFinancialYear() != null)
            fee.setFinancialYear(feeRequest.getFinancialYear());
        if (feeRequest.getFeeDate() != null)
            fee.setPaymentDate(feeRequest.getFeeDate());
        if (feeRequest.getReceiptNumber() != null)
            fee.setTransactionId(feeRequest.getReceiptNumber());
        if (feeRequest.getStatus() != null)
            fee.setPaymentStatus(feeRequest.getStatus());
        if (feeRequest.getRemarks() != null)
            fee.setRemarks(feeRequest.getRemarks());

        return mapToResponse(feeRepository.save(fee));
    }

    @Override
    @Transactional
    public void deleteFee(Integer id) {
        if (id == null)
            throw new IllegalArgumentException("ID cannot be null");
        if (!feeRepository.existsById(id)) {
            throw new SewaException("Fee record not found");
        }
        feeRepository.deleteById(id);
    }

    private FeeResponse mapToResponse(MembershipFee fee) {
        return FeeResponse.builder()
                .id(fee.getId())
                .memberName(fee.getMember() != null ? fee.getMember().getFullName() : "N/A")
                .membershipCode(fee.getMember() != null ? fee.getMember().getMembershipCode() : "N/A")
                .financialYear(fee.getFinancialYear())
                .amount(fee.getAmount())
                .feeDate(fee.getPaymentDate())
                .paymentDate(fee.getPaymentDate())
                .transactionId(fee.getTransactionId())
                .receiptNumber(fee.getTransactionId())
                .status(fee.getPaymentStatus())
                .paymentStatus(fee.getPaymentStatus())
                .remarks(fee.getRemarks())
                .createdAt(fee.getCreatedAt())
                .updatedAt(fee.getUpdatedAt())
                .build();
    }
}
