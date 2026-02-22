package com.sewa.service.impl;

import com.sewa.dto.request.AuthRequest;
import com.sewa.dto.request.RegisterRequest;
import com.sewa.dto.request.ResetPasswordRequest;
import com.sewa.dto.response.AuthResponse;
import com.sewa.entity.Permission;
import com.sewa.entity.PasswordResetOtp;
import com.sewa.entity.Role;
import com.sewa.entity.User;
import com.sewa.entity.Member;
import com.sewa.entity.Student;
import com.sewa.entity.enums.MembershipStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.PasswordResetOtpRepository;
import com.sewa.repository.RoleRepository;
import com.sewa.repository.StudentRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.EmailService;
import com.sewa.security.JwtUtils;
import com.sewa.security.SecurityUser;
import com.sewa.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final int OTP_EXPIRY_MINUTES = 15;
    private static final int OTP_RESEND_COOLDOWN_SECONDS = 60;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final StudentRepository studentRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new SewaException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new SewaException("Email already exists");
        }

        String roleName = request.getMemberType().toUpperCase();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        final String finalRoleName = roleName;
        Role role = roleRepository.findByRoleName(finalRoleName)
                .orElseThrow(() -> new SewaException("Role not found: " + finalRoleName));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(false) // Pending approval
                .roles(Collections.singleton(role))
                .build();

        User savedUser = userRepository.save(user);

        if ("MEMBER".equalsIgnoreCase(request.getMemberType())) {
            Member member = Member.builder()
                    .user(savedUser)
                    .fullName(request.getFullName())
                    .membershipStatus(MembershipStatus.PENDING)
                    .build();
            memberRepository.save(member);
        } else if ("STUDENT".equalsIgnoreCase(request.getMemberType())) {
            Student student = Student.builder()
                    .user(savedUser)
                    .fullName(request.getFullName())
                    .status(MembershipStatus.PENDING)
                    .build();
            studentRepository.save(student);
        }

        return "Registration successful. Pending admin approval.";
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        String login = request.getLogin();
        User foundUser = login != null && login.contains("@")
                ? userRepository.findByEmail(login).orElse(null)
                : userRepository.findByUsername(login).orElse(null);
        if (foundUser == null) {
            throw new BadCredentialsException("Invalid email/username or password");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(foundUser.getUsername(), request.getPassword()));

        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        User user = securityUser.getUser();

        if (!user.getActive()) {
            throw new SewaException("Account is pending approval or inactive");
        }

        String token = jwtUtils.generateToken(securityUser);
        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        Set<String> permissions = user.getRoles().stream()
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .map(Permission::getPermissionCode)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    public AuthResponse getMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        Set<String> permissions = user.getRoles().stream()
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .map(Permission::getPermissionCode)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .username(user.getUsername())
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    public void logout(String token) {
        // In a stateless JWT system, logout is usually handled by frontend destroying
        // the token.
        // For production, you might blacklist the token in Redis here.
        log.info("User logged out. Token invalidated (client-side usually).");
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        if (!userRepository.existsByEmail(email)) {
            log.debug("Forgot password: no account found for email {}, OTP not sent", email);
            return;
        }
        Instant now = Instant.now();
        passwordResetOtpRepository.findTopByEmailOrderByCreatedAtDesc(email).ifPresent(existing -> {
            if (existing.getCreatedAt() == null) return;
            long secondsSinceCreated = now.getEpochSecond() - existing.getCreatedAt().getEpochSecond();
            if (secondsSinceCreated < OTP_RESEND_COOLDOWN_SECONDS) {
                long waitSeconds = OTP_RESEND_COOLDOWN_SECONDS - secondsSinceCreated;
                throw new SewaException(
                        "Please wait " + waitSeconds + " seconds before requesting another OTP.");
            }
        });
        String otp = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));
        Instant expiresAt = now.plusSeconds(OTP_EXPIRY_MINUTES * 60L);
        passwordResetOtpRepository.deleteByEmail(email);
        passwordResetOtpRepository.save(PasswordResetOtp.builder()
                .email(email)
                .otp(otp)
                .expiresAt(expiresAt)
                .createdAt(now)
                .build());
        emailService.sendPasswordResetOtp(email, otp);
    }

    @Override
    public void validateOtp(String email, String otp) {
        Instant now = Instant.now();
        passwordResetOtpRepository
                .findByEmailAndOtpAndExpiresAtAfter(email, otp, now)
                .orElseThrow(() -> new SewaException("Invalid or expired OTP. Please check the code or request a new one."));
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        Instant now = Instant.now();
        PasswordResetOtp otpRecord = passwordResetOtpRepository
                .findByEmailAndOtpAndExpiresAtAfter(request.getEmail(), request.getOtp(), now)
                .orElseThrow(() -> new SewaException("Invalid or expired OTP. Please request a new one."));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new SewaException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetOtpRepository.delete(otpRecord);
    }
}
