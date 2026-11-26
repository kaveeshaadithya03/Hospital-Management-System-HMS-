package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "consultation_fee", nullable = false)
    private BigDecimal consultationFee;

    @Column(name = "lab_fee", nullable = false)
    private BigDecimal labFee;

    @Column(name = "medicine_fee", nullable = false)
    private BigDecimal medicineFee;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus; // PENDING, PAID, CANCELLED

    @Column(name = "payment_method")
    private String paymentMethod; // CASH, CARD, INSURANCE

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    public Bill() {
    }

    public Bill(Patient patient, BigDecimal consultationFee, BigDecimal labFee, BigDecimal medicineFee, BigDecimal totalAmount, String paymentStatus, String paymentMethod, LocalDate billDate) {
        this.patient = patient;
        this.consultationFee = consultationFee;
        this.labFee = labFee;
        this.medicineFee = medicineFee;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.billDate = billDate;
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

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public BigDecimal getLabFee() {
        return labFee;
    }

    public void setLabFee(BigDecimal labFee) {
        this.labFee = labFee;
    }

    public BigDecimal getMedicineFee() {
        return medicineFee;
    }

    public void setMedicineFee(BigDecimal medicineFee) {
        this.medicineFee = medicineFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }
}
