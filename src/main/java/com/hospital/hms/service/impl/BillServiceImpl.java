package com.hospital.hms.service.impl;

import com.hospital.hms.dto.BillDTO;
import com.hospital.hms.entity.Bill;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.BillRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.BillService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public BillServiceImpl(BillRepository billRepository, PatientRepository patientRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public BillDTO createBill(BillDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        BigDecimal consultation = dto.getConsultationFee() != null ? dto.getConsultationFee() : BigDecimal.ZERO;
        BigDecimal lab = dto.getLabFee() != null ? dto.getLabFee() : BigDecimal.ZERO;
        BigDecimal medicine = dto.getMedicineFee() != null ? dto.getMedicineFee() : BigDecimal.ZERO;
        BigDecimal total = consultation.add(lab).add(medicine);

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setConsultationFee(consultation);
        bill.setLabFee(lab);
        bill.setMedicineFee(medicine);
        bill.setTotalAmount(total);
        bill.setPaymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "PENDING");
        bill.setPaymentMethod(dto.getPaymentMethod());
        bill.setBillDate(dto.getBillDate() != null ? dto.getBillDate() : LocalDate.now());

        Bill savedBill = billRepository.save(bill);
        return mapToDTO(savedBill);
    }

    @Override
    public List<BillDTO> getAllBills() {
        return billRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BillDTO getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return mapToDTO(bill);
    }

    @Override
    public List<BillDTO> getBillsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }
        return billRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BillDTO updatePaymentStatus(Long id, String status, String paymentMethod) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setPaymentStatus(status.toUpperCase());
        if (paymentMethod != null) {
            bill.setPaymentMethod(paymentMethod.toUpperCase());
        }

        Bill updatedBill = billRepository.save(bill);
        return mapToDTO(updatedBill);
    }

    @Override
    public void deleteBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        billRepository.delete(bill);
    }

    private BillDTO mapToDTO(Bill bill) {
        return new BillDTO(
                bill.getId(),
                bill.getPatient().getId(),
                bill.getPatient().getFullName(),
                bill.getPatient().getNic(),
                bill.getConsultationFee(),
                bill.getLabFee(),
                bill.getMedicineFee(),
                bill.getTotalAmount(),
                bill.getPaymentStatus(),
                bill.getPaymentMethod(),
                bill.getBillDate()
        );
    }
}
