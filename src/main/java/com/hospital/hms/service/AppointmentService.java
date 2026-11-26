package com.hospital.hms.service;

import com.hospital.hms.dto.AppointmentDTO;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {

    AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO);

    List<AppointmentDTO> getAllAppointments();

    AppointmentDTO getAppointmentById(Long id);

    List<AppointmentDTO> getAppointmentsByPatient(Long patientId);

    List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId);

    List<AppointmentDTO> getAppointmentsByDate(LocalDate date);

    AppointmentDTO updateAppointmentStatus(Long id, String status);

    AppointmentDTO updateAppointment(Long id, AppointmentDTO appointmentDTO);

    void cancelAppointment(Long id);
}
