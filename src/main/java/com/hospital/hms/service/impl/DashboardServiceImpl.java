package com.hospital.hms.service.impl;

import com.hospital.hms.dto.AppointmentDTO;
import com.hospital.hms.dto.DashboardStatsDTO;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.repository.*;
import com.hospital.hms.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;
    private final LabTestRepository labTestRepository;
    private final MedicineRepository medicineRepository;

    public DashboardServiceImpl(PatientRepository patientRepository,
                                DoctorRepository doctorRepository,
                                DepartmentRepository departmentRepository,
                                AppointmentRepository appointmentRepository,
                                BillRepository billRepository,
                                LabTestRepository labTestRepository,
                                MedicineRepository medicineRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
        this.labTestRepository = labTestRepository;
        this.medicineRepository = medicineRepository;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalAppointments = appointmentRepository.count();

        long todayAppointments = appointmentRepository.countByAppointmentDate(LocalDate.now());
        long scheduledAppointments = appointmentRepository.countByStatus("SCHEDULED");
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long cancelledAppointments = appointmentRepository.countByStatus("CANCELLED");

        BigDecimal totalRevenue = billRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long pendingLabTests = labTestRepository.countByStatus("REQUESTED");
        long lowStockMedicines = medicineRepository.countLowStockMedicines();

        List<AppointmentDTO> recentAppointments = appointmentRepository.findTop5ByOrderByIdDesc()
                .stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(
                totalPatients,
                totalDoctors,
                totalDepartments,
                totalAppointments,
                todayAppointments,
                scheduledAppointments,
                completedAppointments,
                cancelledAppointments,
                totalRevenue,
                pendingLabTests,
                lowStockMedicines,
                recentAppointments
        );
    }

    private AppointmentDTO mapToAppointmentDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getFullName(),
                appointment.getDoctor().getSpecialization(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getReason()
        );
    }
}
