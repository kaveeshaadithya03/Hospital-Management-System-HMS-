package com.hospital.hms.repository;

import com.hospital.hms.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String status);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotAndIdNot(
            Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String status, Long id);

    long countByAppointmentDate(LocalDate appointmentDate);

    long countByStatus(String status);

    List<Appointment> findTop5ByOrderByIdDesc();
}
