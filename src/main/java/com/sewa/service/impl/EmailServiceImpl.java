package com.sewa.service.impl;

import com.sewa.exception.SewaException;
import com.sewa.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${sewa.mail.from:hudinjtudu195@gmail.com}")
    private String fromEmail;

    @Value("${sewa.mail.app-name:SEWA}")
    private String appName;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Override
    public void sendPasswordResetOtp(String toEmail, String otp) {
        if (mailPassword == null || mailPassword.isBlank()) {
            log.error("Cannot send OTP email: SEWA_MAIL_PASSWORD (Gmail App Password) is not set. Set it in environment or application.properties.");
            throw new SewaException(
                    "Email is not configured. Please set SEWA_MAIL_PASSWORD (Gmail App Password) in the server environment.");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(appName + " – Password reset OTP");
        message.setText(
                "Your one-time password (OTP) for resetting your password is: " + otp + "\n\n"
                        + "This OTP is valid for 15 minutes. Do not share it with anyone.\n\n"
                        + "If you did not request this, please ignore this email.\n\n"
                        + "— " + appName + " Team");
        try {
            mailSender.send(message);
            log.info("Password reset OTP email sent successfully to {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new SewaException(
                    "Could not send email. For Gmail, use an App Password (not your normal password). Set SEWA_MAIL_PASSWORD in the server environment.");
        }
    }

    @Override
    public void sendCustomEmail(String toEmail, String subject, String body) {
        if (mailPassword == null || mailPassword.isBlank()) {
            log.error("Cannot send custom email: SEWA_MAIL_PASSWORD is not set.");
            throw new SewaException(
                    "Email is not configured. Please set SEWA_MAIL_PASSWORD (Gmail App Password) in the server environment.");
        }
        if (toEmail == null || toEmail.isBlank()) {
            throw new SewaException("Recipient email is required.");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail.trim());
        message.setSubject(subject != null && !subject.isBlank() ? subject : appName + " – Message");
        message.setText(body != null ? body : "");
        try {
            mailSender.send(message);
            log.info("Custom email sent to {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send custom email to {}: {}", toEmail, e.getMessage(), e);
            throw new SewaException(
                    "Could not send email. For Gmail, use an App Password. Set SEWA_MAIL_PASSWORD in the server environment.");
        }
    }
}
