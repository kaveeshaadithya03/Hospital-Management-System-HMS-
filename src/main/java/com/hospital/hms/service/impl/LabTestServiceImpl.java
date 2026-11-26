package com.hospital.hms.service.impl;

import com.hospital.hms.dto.LabTestDTO;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.LabTest;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.LabTestRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.LabTestService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabTestServiceImpl implements LabTestService {

    private final LabTestRepository labTestRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public LabTestServiceImpl(LabTestRepository labTestRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository) {
        this.labTestRepository = labTestRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public LabTestDTO requestLabTest(LabTestDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        LabTest test = new LabTest();
        test.setPatient(patient);
        test.setDoctor(doctor);
        test.setTestName(dto.getTestName());
        test.setTestCategory(dto.getTestCategory() != null ? dto.getTestCategory() : "General");
        test.setCost(dto.getCost() != null ? dto.getCost() : BigDecimal.ZERO);
        test.setStatus(dto.getStatus() != null ? dto.getStatus() : "REQUESTED");
        test.setResultNotes(dto.getResultNotes());
        test.setTestDate(dto.getTestDate() != null ? dto.getTestDate() : LocalDate.now());

        LabTest savedTest = labTestRepository.save(test);
        return mapToDTO(savedTest);
    }

    @Override
    public List<LabTestDTO> getAllLabTests() {
        return labTestRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LabTestDTO getLabTestById(Long id) {
        LabTest test = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));
        return mapToDTO(test);
    }

    @Override
    public List<LabTestDTO> getLabTestsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }
        return labTestRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LabTestDTO updateLabTestResult(Long id, String status, String resultNotes) {
        LabTest test = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));

        if (status != null) {
            test.setStatus(status.toUpperCase());
        }
        if (resultNotes != null) {
            test.setResultNotes(resultNotes);
        }

        LabTest updatedTest = labTestRepository.save(test);
        return mapToDTO(updatedTest);
    }

    @Override
    public void deleteLabTest(Long id) {
        LabTest test = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));
        labTestRepository.delete(test);
    }

    private LabTestDTO mapToDTO(LabTest test) {
        return new LabTestDTO(
                test.getId(),
                test.getPatient().getId(),
                test.getPatient().getFullName(),
                test.getDoctor().getId(),
                test.getDoctor().getFullName(),
                test.getTestName(),
                test.getTestCategory(),
                test.getCost(),
                test.getStatus(),
                test.getResultNotes(),
                test.getTestDate()
        );
    }
}
