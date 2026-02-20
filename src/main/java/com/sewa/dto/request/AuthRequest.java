package com.sewa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 1, max = 100)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 1, max = 500)
    private String password;
}
