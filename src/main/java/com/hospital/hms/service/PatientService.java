package com.hospital.hms.service;

import com.hospital.hms.dto.PatientDTO;
import java.util.List;

public interface PatientService {

    PatientDTO createPatient(PatientDTO patientDTO);

    List<PatientDTO> getAllPatients();

    PatientDTO getPatientById(Long id);

    PatientDTO getPatientByNic(String nic);

    List<PatientDTO> searchPatients(String keyword);

    PatientDTO updatePatient(Long id, PatientDTO patientDTO);

    void deletePatient(Long id);
}
