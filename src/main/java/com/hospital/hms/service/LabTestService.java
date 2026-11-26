package com.hospital.hms.service;

import com.hospital.hms.dto.LabTestDTO;
import java.util.List;

public interface LabTestService {

    LabTestDTO requestLabTest(LabTestDTO labTestDTO);

    List<LabTestDTO> getAllLabTests();

    LabTestDTO getLabTestById(Long id);

    List<LabTestDTO> getLabTestsByPatient(Long patientId);

    LabTestDTO updateLabTestResult(Long id, String status, String resultNotes);

    void deleteLabTest(Long id);
}
