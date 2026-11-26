package com.hospital.hms.controller;

import com.hospital.hms.dto.MedicineDTO;
import com.hospital.hms.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // 1. Add Medicine to Inventory
    @PostMapping
    public ResponseEntity<MedicineDTO> addMedicine(@Valid @RequestBody MedicineDTO medicineDTO) {
        MedicineDTO created = medicineService.addMedicine(medicineDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. Get All Medicines
    @GetMapping
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        List<MedicineDTO> medicines = medicineService.getAllMedicines();
        return ResponseEntity.ok(medicines);
    }

    // 3. Get Low Stock Medicines Alert List
    @GetMapping("/low-stock")
    public ResponseEntity<List<MedicineDTO>> getLowStockMedicines() {
        List<MedicineDTO> medicines = medicineService.getLowStockMedicines();
        return ResponseEntity.ok(medicines);
    }

    // 4. Get Medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTO> getMedicineById(@PathVariable Long id) {
        MedicineDTO medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(medicine);
    }

    // 5. Update Medicine Details
    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTO> updateMedicine(@PathVariable Long id, @Valid @RequestBody MedicineDTO medicineDTO) {
        MedicineDTO updated = medicineService.updateMedicine(id, medicineDTO);
        return ResponseEntity.ok(updated);
    }

    // 6. Update Stock Quantity (+ or -)
    @PatchMapping("/{id}/stock")
    public ResponseEntity<MedicineDTO> updateStockQuantity(
            @PathVariable Long id, @RequestParam("change") Integer change) {
        MedicineDTO updated = medicineService.updateStockQuantity(id, change);
        return ResponseEntity.ok(updated);
    }

    // 7. Delete Medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine removed from inventory");
    }
}
