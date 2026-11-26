package com.hospital.hms.service.impl;

import com.hospital.hms.dto.AuthResponseDTO;
import com.hospital.hms.dto.LoginRequestDTO;
import com.hospital.hms.dto.RegisterRequestDTO;
import com.hospital.hms.entity.User;
import com.hospital.hms.exception.ResourceAlreadyExistsException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.UserRepository;
import com.hospital.hms.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponseDTO registerUser(RegisterRequestDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ResourceAlreadyExistsException("Username '" + dto.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email '" + dto.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword()); // In production, hash with BCrypt
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole().toUpperCase());

        User savedUser = userRepository.save(user);

        String mockToken = "Bearer-token-" + UUID.randomUUID().toString();

        return new AuthResponseDTO(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getRole(),
                mockToken
        );
    }

    @Override
    public AuthResponseDTO loginUser(LoginRequestDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        String mockToken = "Bearer-token-" + UUID.randomUUID().toString();

        return new AuthResponseDTO(
                "Login successful",
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                mockToken
        );
    }

    @Override
    public List<AuthResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new AuthResponseDTO(
                        "User retrieved",
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getRole(),
                        null
                ))
                .collect(Collectors.toList());
    }
}
