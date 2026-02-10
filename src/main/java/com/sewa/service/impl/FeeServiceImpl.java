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
    @Transactional
    public FeeResponse saveFee(FeeRequest feeRequest) {
        Member member = memberRepository.findById(feeRequest.getMemberId())
                .orElseThrow(() -> new SewaException("Member not found"));

        MembershipFee fee = MembershipFee.builder()
                .member(member)
                .amount(feeRequest.getAmount())
                .paymentDate(feeRequest.getFeeDate())
                .transactionId(feeRequest.getTransactionId())
                .paymentStatus(feeRequest.getStatus())
                .build();

        return mapToResponse(feeRepository.save(fee));
    }

    private FeeResponse mapToResponse(MembershipFee fee) {
        return FeeResponse.builder()
                .id(fee.getId())
                .memberName(fee.getMember() != null ? fee.getMember().getFullName() : "N/A")
                .membershipCode(fee.getMember() != null ? fee.getMember().getMembershipCode() : "N/A")
                .amount(fee.getAmount())
                .feeDate(fee.getPaymentDate())
                .transactionId(fee.getTransactionId())
                .status(fee.getPaymentStatus())
                .createdAt(fee.getCreatedAt())
                .updatedAt(fee.getUpdatedAt())
                .build();
    }
}
