package com.sewa.service;

import com.sewa.dto.request.AuthRequest;
import com.sewa.dto.request.RegisterRequest;
import com.sewa.dto.response.AuthResponse;

public interface AuthService {
    String register(RegisterRequest request);

    AuthResponse login(AuthRequest request);

    AuthResponse getMe(String username);

    void logout(String token);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}
