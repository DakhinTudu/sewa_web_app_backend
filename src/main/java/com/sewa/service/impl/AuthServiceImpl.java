package com.sewa.service.impl;

import com.sewa.dto.request.AuthRequest;
import com.sewa.dto.request.RegisterRequest;
import com.sewa.dto.response.AuthResponse;
import com.sewa.entity.Role;
import com.sewa.entity.User;
import com.sewa.entity.Member;
import com.sewa.entity.Student;
import com.sewa.entity.enums.MembershipStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.RoleRepository;
import com.sewa.repository.StudentRepository;
import com.sewa.repository.UserRepository;
import com.sewa.security.JwtUtils;
import com.sewa.security.SecurityUser;
import com.sewa.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final StudentRepository studentRepository;
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

        user = userRepository.save(user);

        if ("MEMBER".equalsIgnoreCase(request.getMemberType())) {
            Member member = Member.builder()
                    .user(user)
                    .fullName(request.getFullName())
                    .membershipStatus(MembershipStatus.PENDING)
                    .build();
            memberRepository.save(member);
        } else if ("STUDENT".equalsIgnoreCase(request.getMemberType())) {
            Student student = Student.builder()
                    .user(user)
                    .fullName(request.getFullName())
                    .status(MembershipStatus.PENDING)
                    .build();
            studentRepository.save(student);
        }

        return "Registration successful. Pending admin approval.";
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        User user = securityUser.getUser();

        if (!user.getActive()) {
            throw new SewaException("Account is pending approval or inactive");
        }

        String token = jwtUtils.generateToken(securityUser);
        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    public AuthResponse getMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .username(user.getUsername())
                .roles(roles)
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
    public void forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new SewaException("Email not found");
        }
        // Logic to generate reset token and send email
        log.info("Password reset requested for: {}", email);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // Logic to validate token and update password
        log.info("Password reset with token attempted");
    }
}
