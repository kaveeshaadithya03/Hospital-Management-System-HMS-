package com.hospital.hms.service;

import com.hospital.hms.dto.MedicalRecordDTO;
import java.util.List;

public interface MedicalRecordService {

    MedicalRecordDTO createMedicalRecord(MedicalRecordDTO medicalRecordDTO);

    List<MedicalRecordDTO> getAllMedicalRecords();

    MedicalRecordDTO getMedicalRecordById(Long id);

    List<MedicalRecordDTO> getMedicalRecordsByPatient(Long patientId);

    List<MedicalRecordDTO> getMedicalRecordsByDoctor(Long doctorId);

    MedicalRecordDTO updateMedicalRecord(Long id, MedicalRecordDTO medicalRecordDTO);

    void deleteMedicalRecord(Long id);
}
