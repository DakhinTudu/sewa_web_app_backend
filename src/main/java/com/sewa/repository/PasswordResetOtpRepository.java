package com.sewa.repository;

import com.sewa.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findByEmailAndOtpAndExpiresAtAfter(String email, String otp, java.time.Instant now);

    Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    void deleteByEmail(String email);
}
