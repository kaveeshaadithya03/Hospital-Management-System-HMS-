package com.hospital.hms.service;

import com.hospital.hms.dto.BillDTO;
import java.util.List;

public interface BillService {

    BillDTO createBill(BillDTO billDTO);

    List<BillDTO> getAllBills();

    BillDTO getBillById(Long id);

    List<BillDTO> getBillsByPatient(Long patientId);

    BillDTO updatePaymentStatus(Long id, String status, String paymentMethod);

    void deleteBill(Long id);
}
