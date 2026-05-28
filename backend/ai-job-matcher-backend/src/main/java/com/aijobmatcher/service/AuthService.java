package com.aijobmatcher.service;

import com.aijobmatcher.dto.AuthResponse;
import com.aijobmatcher.dto.LoginRequest;
import com.aijobmatcher.dto.RegisterRequest;
import com.aijobmatcher.model.User;
import com.aijobmatcher.repository.UserRepository;
import com.aijobmatcher.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole(),
                token,
                refreshToken
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                token,
                refreshToken
        );
    }
}
