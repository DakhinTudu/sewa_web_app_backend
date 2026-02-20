package com.sewa.service;

import com.sewa.dto.request.FeeRequest;
import com.sewa.dto.response.FeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeeService {
    List<FeeResponse> getFeesByMember(Integer memberId);

    List<FeeResponse> getFeesByMemberCode(String code);

    Page<FeeResponse> getAllFees(Pageable pageable);

    Page<FeeResponse> searchFees(String query, com.sewa.entity.enums.PaymentStatus status, String year,
            Pageable pageable);

    FeeResponse saveFee(FeeRequest feeRequest);

    FeeResponse updateFee(Integer id, FeeRequest feeRequest);

    void deleteFee(Integer id);
}
