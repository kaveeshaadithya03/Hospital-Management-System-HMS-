package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "laboratory_tests")
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "test_category")
    private String testCategory; // Blood, Urine, X-Ray, MRI, etc.

    @Column(name = "cost", nullable = false)
    private BigDecimal cost;

    @Column(name = "status", nullable = false)
    private String status; // REQUESTED, COMPLETED, CANCELLED

    @Column(name = "result_notes", columnDefinition = "TEXT")
    private String resultNotes;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    public LabTest() {
    }

    public LabTest(Patient patient, Doctor doctor, String testName, String testCategory, BigDecimal cost, String status, String resultNotes, LocalDate testDate) {
        this.patient = patient;
        this.doctor = doctor;
        this.testName = testName;
        this.testCategory = testCategory;
        this.cost = cost;
        this.status = status;
        this.resultNotes = resultNotes;
        this.testDate = testDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestCategory() {
        return testCategory;
    }

    public void setTestCategory(String testCategory) {
        this.testCategory = testCategory;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResultNotes() {
        return resultNotes;
    }

    public void setResultNotes(String resultNotes) {
        this.resultNotes = resultNotes;
    }

    public LocalDate getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDate testDate) {
        this.testDate = testDate;
    }
}
