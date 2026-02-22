package com.sewa.service;

public interface EmailService {

    void sendPasswordResetOtp(String toEmail, String otp);

    void sendCustomEmail(String toEmail, String subject, String body);
}
