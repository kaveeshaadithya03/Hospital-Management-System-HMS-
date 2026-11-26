import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import LaboratoryPage from './pages/LaboratoryPage';
import PharmacyPage from './pages/PharmacyPage';
import BillingPage from './pages/BillingPage';

const ProtectedLayout = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase() || 'ADMIN';
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                <DashboardPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/departments"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'RECEPTIONIST']}>
                <DepartmentsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'RECEPTIONIST']}>
                <DoctorsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                <PatientsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                <AppointmentsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/medical-records"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'DOCTOR']}>
                <MedicalRecordsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/laboratory"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'DOCTOR']}>
                <LaboratoryPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/pharmacy"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'RECEPTIONIST']}>
                <PharmacyPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedLayout allowedRoles={['ADMIN', 'RECEPTIONIST']}>
                <BillingPage />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
