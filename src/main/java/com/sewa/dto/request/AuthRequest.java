package com.sewa.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    @NotBlank(message = "Email or username is required")
    @Size(min = 1, max = 255)
    @JsonAlias("username")
    private String login;

    @NotBlank(message = "Password is required")
    @Size(min = 1, max = 500)
    private String password;
}
