package com.hospital.hms.service.impl;

import com.hospital.hms.dto.PatientDTO;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.exception.ResourceAlreadyExistsException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        if (patientRepository.existsByNic(patientDTO.getNic())) {
            throw new ResourceAlreadyExistsException("Patient with NIC '" + patientDTO.getNic() + "' already exists");
        }

        Patient patient = mapToEntity(patientDTO);
        Patient savedPatient = patientRepository.save(patient);
        return mapToDTO(savedPatient);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToDTO(patient);
    }

    @Override
    public PatientDTO getPatientByNic(String nic) {
        Patient patient = patientRepository.findByNic(nic)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with NIC: " + nic));
        return mapToDTO(patient);
    }

    @Override
    public List<PatientDTO> searchPatients(String keyword) {
        return patientRepository.findByFullNameContainingIgnoreCaseOrNicContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (patientRepository.existsByNicAndIdNot(patientDTO.getNic(), id)) {
            throw new ResourceAlreadyExistsException("Another patient with NIC '" + patientDTO.getNic() + "' already exists");
        }

        patient.setFullName(patientDTO.getFullName());
        patient.setNic(patientDTO.getNic());
        patient.setDob(patientDTO.getDob());
        patient.setGender(patientDTO.getGender());
        patient.setPhone(patientDTO.getPhone());
        patient.setEmail(patientDTO.getEmail());
        patient.setAddress(patientDTO.getAddress());
        patient.setBloodGroup(patientDTO.getBloodGroup());

        Patient updatedPatient = patientRepository.save(patient);
        return mapToDTO(updatedPatient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    // Helper method to convert Entity to DTO
    private PatientDTO mapToDTO(Patient patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getFullName(),
                patient.getNic(),
                patient.getDob(),
                patient.getGender(),
                patient.getPhone(),
                patient.getEmail(),
                patient.getAddress(),
                patient.getBloodGroup()
        );
    }

    // Helper method to convert DTO to Entity
    private Patient mapToEntity(PatientDTO dto) {
        Patient patient = new Patient();
        patient.setFullName(dto.getFullName());
        patient.setNic(dto.getNic());
        patient.setDob(dto.getDob());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setBloodGroup(dto.getBloodGroup());
        return patient;
    }
}
