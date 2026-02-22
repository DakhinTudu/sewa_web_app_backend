package com.sewa.service.impl;

import com.sewa.exception.SewaException;
import com.sewa.service.EmailService;
import jakarta.annotation.PostConstruct;
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

    @Value("${sewa.mail.from:}")
    private String fromEmail;

    @Value("${sewa.mail.app-name:SEWA}")
    private String appName;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @PostConstruct
    public void logMailConfigStatus() {
        boolean configured = mailPassword != null && !mailPassword.isBlank()
                && mailUsername != null && !mailUsername.isBlank();
        if (configured) {
            log.info("Mail configured: yes (SEWA_MAIL_USERNAME and SEWA_MAIL_PASSWORD set). Forgot-password and Communications will send email.");
        } else {
            log.warn("Mail configured: no. SEWA_MAIL_USERNAME and SEWA_MAIL_PASSWORD must be set in environment for forgot-password OTP and Communications. Requests will fail with a clear error.");
        }
    }

    private void requireMailConfigured() {
        if (mailPassword == null || mailPassword.isBlank()) {
            log.error("Cannot send email: SEWA_MAIL_PASSWORD is not set.");
            throw new SewaException(
                    "Email is not configured. Set SEWA_MAIL_PASSWORD (Gmail App Password) in Render → Environment, then redeploy.");
        }
        if (fromEmail == null || fromEmail.isBlank()) {
            log.error("Cannot send email: SEWA_MAIL_USERNAME (sewa.mail.from) is not set.");
            throw new SewaException(
                    "Email is not configured. Set SEWA_MAIL_USERNAME in Render → Environment, then redeploy.");
        }
    }

    private String sanitizeMailError(MailException e) {
        String msg = e.getMessage();
        if (msg == null) msg = e.getClass().getSimpleName();
        if (msg.length() > 200) msg = msg.substring(0, 200) + "...";
        return msg;
    }

    @Override
    public void sendPasswordResetOtp(String toEmail, String otp) {
        requireMailConfigured();
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
                    "Could not send email: " + sanitizeMailError(e) + ". For Gmail use an App Password (not your normal password).");
        }
    }

    @Override
    public void sendCustomEmail(String toEmail, String subject, String body) {
        requireMailConfigured();
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
                    "Could not send email: " + sanitizeMailError(e) + ". For Gmail use an App Password.");
        }
    }
}
