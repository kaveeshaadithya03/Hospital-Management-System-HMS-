package com.hospital.hms.service;

import com.hospital.hms.dto.AuthResponseDTO;
import com.hospital.hms.dto.LoginRequestDTO;
import com.hospital.hms.dto.RegisterRequestDTO;

import java.util.List;

public interface UserService {

    AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO);

    AuthResponseDTO loginUser(LoginRequestDTO loginRequestDTO);

    List<AuthResponseDTO> getAllUsers();
}
