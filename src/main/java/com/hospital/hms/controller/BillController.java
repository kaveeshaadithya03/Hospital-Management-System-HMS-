package com.hospital.hms.controller;

import com.hospital.hms.dto.BillDTO;
import com.hospital.hms.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // 1. Create Invoice / Bill
    @PostMapping
    public ResponseEntity<BillDTO> createBill(@Valid @RequestBody BillDTO billDTO) {
        BillDTO createdBill = billService.createBill(billDTO);
        return new ResponseEntity<>(createdBill, HttpStatus.CREATED);
    }

    // 2. Get All Bills
    @GetMapping
    public ResponseEntity<List<BillDTO>> getAllBills() {
        List<BillDTO> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }

    // 3. Get Bill by ID
    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBillById(@PathVariable Long id) {
        BillDTO bill = billService.getBillById(id);
        return ResponseEntity.ok(bill);
    }

    // 4. Get Bills by Patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<BillDTO>> getBillsByPatient(@PathVariable Long patientId) {
        List<BillDTO> bills = billService.getBillsByPatient(patientId);
        return ResponseEntity.ok(bills);
    }

    // 5. Update Payment Status (e.g. PAID, CASH/CARD)
    @PatchMapping("/{id}/pay")
    public ResponseEntity<BillDTO> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "method", required = false) String method) {
        BillDTO updatedBill = billService.updatePaymentStatus(id, status, method);
        return ResponseEntity.ok(updatedBill);
    }

    // 6. Delete Bill
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok("Bill deleted successfully");
    }
}
