package com.hospital.hms.controller;

import com.hospital.hms.dto.LabTestDTO;
import com.hospital.hms.service.LabTestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
@CrossOrigin(origins = "*")
public class LabTestController {

    private final LabTestService labTestService;

    public LabTestController(LabTestService labTestService) {
        this.labTestService = labTestService;
    }

    // 1. Request Lab Test
    @PostMapping
    public ResponseEntity<LabTestDTO> requestLabTest(@Valid @RequestBody LabTestDTO labTestDTO) {
        LabTestDTO created = labTestService.requestLabTest(labTestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. Get All Lab Tests
    @GetMapping
    public ResponseEntity<List<LabTestDTO>> getAllLabTests() {
        List<LabTestDTO> tests = labTestService.getAllLabTests();
        return ResponseEntity.ok(tests);
    }

    // 3. Get Lab Test by ID
    @GetMapping("/{id}")
    public ResponseEntity<LabTestDTO> getLabTestById(@PathVariable Long id) {
        LabTestDTO test = labTestService.getLabTestById(id);
        return ResponseEntity.ok(test);
    }

    // 4. Get Lab Tests by Patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabTestDTO>> getLabTestsByPatient(@PathVariable Long patientId) {
        List<LabTestDTO> tests = labTestService.getLabTestsByPatient(patientId);
        return ResponseEntity.ok(tests);
    }

    // 5. Update Lab Result / Status
    @PatchMapping("/{id}/result")
    public ResponseEntity<LabTestDTO> updateLabTestResult(
            @PathVariable Long id,
            @RequestParam("status") String status,
            @RequestBody(required = false) String resultNotes) {
        LabTestDTO updated = labTestService.updateLabTestResult(id, status, resultNotes);
        return ResponseEntity.ok(updated);
    }

    // 6. Delete Lab Test
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLabTest(@PathVariable Long id) {
        labTestService.deleteLabTest(id);
        return ResponseEntity.ok("Lab test request deleted successfully");
    }
}
