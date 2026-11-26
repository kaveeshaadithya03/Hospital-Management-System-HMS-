package com.hospital.hms.controller;

import com.hospital.hms.dto.AuthResponseDTO;
import com.hospital.hms.dto.LoginRequestDTO;
import com.hospital.hms.dto.RegisterRequestDTO;
import com.hospital.hms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 1. User Registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        AuthResponseDTO response = userService.registerUser(registerRequestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. User Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        AuthResponseDTO response = userService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(response);
    }

    // 3. Get All Users (Admin list view)
    @GetMapping("/users")
    public ResponseEntity<List<AuthResponseDTO>> getAllUsers() {
        List<AuthResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
