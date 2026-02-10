package com.sewa.service;

import com.sewa.dto.request.FeeRequest;
import com.sewa.dto.response.FeeResponse;
import java.util.List;

public interface FeeService {
    List<FeeResponse> getFeesByMember(Integer memberId);

    List<FeeResponse> getFeesByMemberCode(String code);

    FeeResponse saveFee(FeeRequest feeRequest);
}
