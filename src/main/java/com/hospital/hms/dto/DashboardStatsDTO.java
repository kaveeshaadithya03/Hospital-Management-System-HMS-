package com.hospital.hms.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTO {

    private long totalPatients;
    private long totalDoctors;
    private long totalDepartments;
    private long totalAppointments;
    private long todayAppointments;
    private long scheduledAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private BigDecimal totalRevenue;
    private long pendingLabTests;
    private long lowStockMedicines;
    private List<AppointmentDTO> recentAppointments;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalPatients, long totalDoctors, long totalDepartments,
                             long totalAppointments, long todayAppointments,
                             long scheduledAppointments, long completedAppointments,
                             long cancelledAppointments, BigDecimal totalRevenue,
                             long pendingLabTests, long lowStockMedicines,
                             List<AppointmentDTO> recentAppointments) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalDepartments = totalDepartments;
        this.totalAppointments = totalAppointments;
        this.todayAppointments = todayAppointments;
        this.scheduledAppointments = scheduledAppointments;
        this.completedAppointments = completedAppointments;
        this.cancelledAppointments = cancelledAppointments;
        this.totalRevenue = totalRevenue;
        this.pendingLabTests = pendingLabTests;
        this.lowStockMedicines = lowStockMedicines;
        this.recentAppointments = recentAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTodayAppointments() {
        return todayAppointments;
    }

    public void setTodayAppointments(long todayAppointments) {
        this.todayAppointments = todayAppointments;
    }

    public long getScheduledAppointments() {
        return scheduledAppointments;
    }

    public void setScheduledAppointments(long scheduledAppointments) {
        this.scheduledAppointments = scheduledAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public long getCancelledAppointments() {
        return cancelledAppointments;
    }

    public void setCancelledAppointments(long cancelledAppointments) {
        this.cancelledAppointments = cancelledAppointments;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingLabTests() {
        return pendingLabTests;
    }

    public void setPendingLabTests(long pendingLabTests) {
        this.pendingLabTests = pendingLabTests;
    }

    public long getLowStockMedicines() {
        return lowStockMedicines;
    }

    public void setLowStockMedicines(long lowStockMedicines) {
        this.lowStockMedicines = lowStockMedicines;
    }

    public List<AppointmentDTO> getRecentAppointments() {
        return recentAppointments;
    }

    public void setRecentAppointments(List<AppointmentDTO> recentAppointments) {
        this.recentAppointments = recentAppointments;
    }
}
