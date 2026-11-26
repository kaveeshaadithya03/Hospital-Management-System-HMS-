package com.hospital.hms.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BillDTO {

    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private String patientName;
    private String patientNic;

    private BigDecimal consultationFee;
    private BigDecimal labFee;
    private BigDecimal medicineFee;
    private BigDecimal totalAmount;

    private String paymentStatus; // PENDING, PAID, CANCELLED
    private String paymentMethod; // CASH, CARD, INSURANCE
    private LocalDate billDate;

    public BillDTO() {
    }

    public BillDTO(Long id, Long patientId, String patientName, String patientNic, BigDecimal consultationFee, BigDecimal labFee, BigDecimal medicineFee, BigDecimal totalAmount, String paymentStatus, String paymentMethod, LocalDate billDate) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNic = patientNic;
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

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientNic() {
        return patientNic;
    }

    public void setPatientNic(String patientNic) {
        this.patientNic = patientNic;
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
