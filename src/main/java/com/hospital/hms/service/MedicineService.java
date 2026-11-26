package com.hospital.hms.service;

import com.hospital.hms.dto.MedicineDTO;
import java.util.List;

public interface MedicineService {

    MedicineDTO addMedicine(MedicineDTO medicineDTO);

    List<MedicineDTO> getAllMedicines();

    MedicineDTO getMedicineById(Long id);

    List<MedicineDTO> getLowStockMedicines();

    MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO);

    MedicineDTO updateStockQuantity(Long id, Integer quantityChange);

    void deleteMedicine(Long id);
}
