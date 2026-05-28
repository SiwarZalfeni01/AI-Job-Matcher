package com.aijobmatcher.controller;

import com.aijobmatcher.dto.AuthResponse;
import com.aijobmatcher.dto.LoginRequest;
import com.aijobmatcher.dto.RegisterRequest;
import com.aijobmatcher.model.UserRole;
import com.aijobmatcher.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAuthStatus() throws Exception {
        mockMvc.perform(get("/api/auth/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Auth test successful"));
    }

    @Test
    public void testRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setName("Test User");
        request.setRole(UserRole.CANDIDATE);

        AuthResponse response = new AuthResponse();
        response.setToken("fake-jwt-token");
        response.setEmail("test@example.com");

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        AuthResponse response = new AuthResponse();
        response.setToken("fake-jwt-token");
        response.setEmail("test@example.com");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
