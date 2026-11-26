package com.hospital.hms.service.impl;

import com.hospital.hms.dto.AppointmentDTO;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.exception.ResourceAlreadyExistsException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.AppointmentService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository,
                                  DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public AppointmentDTO bookAppointment(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        // Check if doctor has conflicting appointment at the same date & time slot (excluding CANCELLED)
        boolean hasConflict = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                dto.getDoctorId(), dto.getAppointmentDate(), dto.getAppointmentTime(), "CANCELLED"
        );

        if (hasConflict) {
            throw new ResourceAlreadyExistsException(
                    "Doctor is already booked at " + dto.getAppointmentTime() + " on " + dto.getAppointmentDate()
            );
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : "SCHEDULED");
        appointment.setReason(dto.getReason());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(savedAppointment);
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapToDTO(appointment);
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus(status.toUpperCase());
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(updatedAppointment);
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        boolean hasConflict = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotAndIdNot(
                dto.getDoctorId(), dto.getAppointmentDate(), dto.getAppointmentTime(), "CANCELLED", id
        );

        if (hasConflict) {
            throw new ResourceAlreadyExistsException(
                    "Doctor is already booked at " + dto.getAppointmentTime() + " on " + dto.getAppointmentDate()
            );
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }
        appointment.setReason(dto.getReason());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToDTO(updatedAppointment);
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
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
