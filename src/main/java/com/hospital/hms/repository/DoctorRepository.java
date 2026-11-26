package com.hospital.hms.repository;

import com.hospital.hms.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByDepartmentId(Long departmentId);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
