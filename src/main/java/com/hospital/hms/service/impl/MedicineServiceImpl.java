package com.hospital.hms.service.impl;

import com.hospital.hms.dto.MedicineDTO;
import com.hospital.hms.entity.Medicine;
import com.hospital.hms.exception.ResourceAlreadyExistsException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.MedicineRepository;
import com.hospital.hms.service.MedicineService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @Override
    public MedicineDTO addMedicine(MedicineDTO dto) {
        if (medicineRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistsException("Medicine with name '" + dto.getName() + "' already exists");
        }

        Medicine medicine = mapToEntity(dto);
        Medicine savedMedicine = medicineRepository.save(medicine);
        return mapToDTO(savedMedicine);
    }

    @Override
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        return mapToDTO(medicine);
    }

    @Override
    public List<MedicineDTO> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineDTO updateMedicine(Long id, MedicineDTO dto) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        if (medicineRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new ResourceAlreadyExistsException("Another medicine with name '" + dto.getName() + "' already exists");
        }

        medicine.setName(dto.getName());
        medicine.setCategory(dto.getCategory());
        medicine.setUnitPrice(dto.getUnitPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setReorderLevel(dto.getReorderLevel());
        medicine.setExpiryDate(dto.getExpiryDate());

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToDTO(updatedMedicine);
    }

    @Override
    public MedicineDTO updateStockQuantity(Long id, Integer quantityChange) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));

        int newStock = medicine.getStockQuantity() + quantityChange;
        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient stock for medicine: " + medicine.getName());
        }

        medicine.setStockQuantity(newStock);
        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToDTO(updatedMedicine);
    }

    @Override
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        medicineRepository.delete(medicine);
    }

    private MedicineDTO mapToDTO(Medicine medicine) {
        boolean isLow = medicine.getStockQuantity() <= medicine.getReorderLevel();
        return new MedicineDTO(
                medicine.getId(),
                medicine.getName(),
                medicine.getCategory(),
                medicine.getUnitPrice(),
                medicine.getStockQuantity(),
                medicine.getReorderLevel(),
                medicine.getExpiryDate(),
                isLow
        );
    }

    private Medicine mapToEntity(MedicineDTO dto) {
        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setCategory(dto.getCategory());
        medicine.setUnitPrice(dto.getUnitPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setReorderLevel(dto.getReorderLevel());
        medicine.setExpiryDate(dto.getExpiryDate());
        return medicine;
    }
}
