package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.request.AuthRequest;
import com.sewa.dto.request.RegisterRequest;
import com.sewa.dto.response.AuthResponse;
import com.sewa.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new member or student account (pending approval)")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String result = authService.register(request);
        return ResponseEntity.ok(ApiResponseBuilder.success(result, "User registered successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Login with username and password to receive JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponseBuilder.success(response, "Login successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user info", description = "Fetch details of the currently authenticated user")
    public ResponseEntity<ApiResponse<AuthResponse>> getMe(java.security.Principal principal) {
        AuthResponse response = authService.getMe(principal.getName());
        return ResponseEntity.ok(ApiResponseBuilder.success(response, "User details fetched"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidate the current session/token")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Logout successful"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Request a password reset link via email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Password reset email sent if account exists"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password using a valid token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestParam String token,
            @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Password reset successful"));
    }
}
