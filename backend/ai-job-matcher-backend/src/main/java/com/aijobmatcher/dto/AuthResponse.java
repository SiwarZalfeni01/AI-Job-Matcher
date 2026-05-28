package com.aijobmatcher.dto;

import com.aijobmatcher.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String name;
    private UserRole role;
    private String token;
    private String refreshToken;
}
