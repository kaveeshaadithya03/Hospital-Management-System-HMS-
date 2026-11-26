import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '09:00:00',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, patRes, docRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/patients'),
        API.get('/doctors')
      ]);
      setAppointments(appRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      setError('Failed to fetch appointments data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setSuccess('');
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      doctorId: doctors.length > 0 ? doctors[0].id : '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '09:00:00',
      reason: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Check slot availability.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await API.patch(`/appointments/${id}/status?status=${newStatus}`);
      setSuccess(`Appointment status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/appointments/${id}`);
      setSuccess('Appointment cancelled.');
      fetchData();
    } catch (err) {
      setError('Failed to cancel appointment.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Appointment Management</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + Book Appointment
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>Loading appointments...</td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td style={{ fontWeight: 600 }}>{app.patientName}</td>
                    <td>{app.doctorName} <small style={{ color: '#64748b' }}>({app.doctorSpecialization})</small></td>
                    <td>{app.appointmentDate}</td>
                    <td>{app.appointmentTime}</td>
                    <td>{app.reason || '—'}</td>
                    <td>
                      <span className={`badge badge-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {app.status === 'SCHEDULED' && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleStatusChange(app.id, 'COMPLETED')}
                            style={{ marginRight: '6px' }}
                          >
                            Mark Done ✓
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(app.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#64748b' }}>
                    No appointments scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Appointment</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Patient *</label>
                <select
                  className="select"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} (NIC: {p.nic})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Doctor *</label>
                <select
                  className="select"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.fullName} - {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    className="input"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea
                  className="textarea"
                  rows="2"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Regular Checkup, Chest Pain, Fever"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
