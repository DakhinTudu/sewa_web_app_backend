package com.sewa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForgotPasswordResponse {

    /**
     * The email address to which the OTP was sent (or was requested).
     * Returned so the frontend can display "OTP sent to {email}".
     */
    private String email;
}
