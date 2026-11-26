package com.hospital.hms.repository;

import com.hospital.hms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    boolean existsByNic(String nic);

    boolean existsByNicAndIdNot(String nic, Long id);

    Optional<Patient> findByNic(String nic);

    List<Patient> findByFullNameContainingIgnoreCaseOrNicContainingIgnoreCase(String fullName, String nic);
}
