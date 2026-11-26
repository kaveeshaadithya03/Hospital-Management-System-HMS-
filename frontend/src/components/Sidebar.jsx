import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const role = user?.role?.toUpperCase() || 'ADMIN';

  // Role permissions mapping
  const canAccessDepartments = role === 'ADMIN' || role === 'RECEPTIONIST';
  const canAccessDoctors = role === 'ADMIN' || role === 'RECEPTIONIST';
  const canAccessPatients = true; // All roles can view patients
  const canAccessAppointments = true; // All roles can view appointments
  const canAccessMedicalRecords = role === 'ADMIN' || role === 'DOCTOR';
  const canAccessLaboratory = role === 'ADMIN' || role === 'DOCTOR';
  const canAccessPharmacy = role === 'ADMIN' || role === 'RECEPTIONIST';
  const canAccessBilling = role === 'ADMIN' || role === 'RECEPTIONIST';

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        🏥 Hospital HMS
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          📊 Dashboard
        </NavLink>

        {canAccessDepartments && (
          <NavLink to="/departments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            🏢 Departments
          </NavLink>
        )}

        {canAccessDoctors && (
          <NavLink to="/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            👨‍⚕️ Doctors
          </NavLink>
        )}

        {canAccessPatients && (
          <NavLink to="/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            🤒 Patients
          </NavLink>
        )}

        {canAccessAppointments && (
          <NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            📅 Appointments
          </NavLink>
        )}

        {canAccessMedicalRecords && (
          <NavLink to="/medical-records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            📋 Medical Records
          </NavLink>
        )}

        {canAccessLaboratory && (
          <NavLink to="/laboratory" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            🧪 Laboratory
          </NavLink>
        )}

        {canAccessPharmacy && (
          <NavLink to="/pharmacy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            💊 Pharmacy
          </NavLink>
        )}

        {canAccessBilling && (
          <NavLink to="/billing" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            💳 Billing & Payments
          </NavLink>
        )}
      </nav>
    </div>
  );
}
