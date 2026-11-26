import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container">Loading dashboard stats...</div>;
  if (error) return <div className="page-container alert-error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Hospital Overview Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-title">TOTAL PATIENTS</div>
          <div className="stat-card-value">{stats?.totalPatients || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">TOTAL DOCTORS</div>
          <div className="stat-card-value">{stats?.totalDoctors || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">DEPARTMENTS</div>
          <div className="stat-card-value">{stats?.totalDepartments || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">TOTAL REVENUE (LKR)</div>
          <div className="stat-card-value" style={{ color: '#16a34a' }}>
            LKR {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0.00'}
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="stat-card-title">TODAY'S APPOINTMENTS</div>
          <div className="stat-card-value">{stats?.todayAppointments || 0}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="stat-card-title">PENDING LAB TESTS</div>
          <div className="stat-card-value">{stats?.pendingLabTests || 0}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="stat-card-title">LOW STOCK MEDICINES</div>
          <div className="stat-card-value">{stats?.lowStockMedicines || 0}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="stat-card-title">COMPLETED APPOINTMENTS</div>
          <div className="stat-card-value">{stats?.completedAppointments || 0}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Appointments</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                stats.recentAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>{app.patientName}</td>
                    <td>{app.doctorName}</td>
                    <td>{app.appointmentDate}</td>
                    <td>{app.appointmentTime}</td>
                    <td>
                      <span className={`badge badge-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                    No appointments booked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
