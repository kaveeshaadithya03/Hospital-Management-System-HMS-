import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, patRes, docRes] = await Promise.all([
        API.get('/medical-records'),
        API.get('/patients'),
        API.get('/doctors')
      ]);
      setRecords(recRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      setError('Failed to fetch medical records.');
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
      diagnosis: '',
      prescription: '',
      notes: ''
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
      await API.post('/medical-records', formData);
      setSuccess('Medical record added successfully!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding medical record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/medical-records/${id}`);
      setSuccess('Medical record deleted.');
      fetchData();
    } catch (err) {
      setError('Failed to delete medical record.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Medical Records & Prescriptions</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + Create Medical Record
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Patient</th>
                <th>Attending Doctor</th>
                <th>Diagnosis</th>
                <th>Prescription</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Loading medical records...</td>
                </tr>
              ) : records.length > 0 ? (
                records.map((rec) => (
                  <tr key={rec.id}>
                    <td>#{rec.id}</td>
                    <td style={{ fontWeight: 600 }}>{rec.patientName}</td>
                    <td>{rec.doctorName}</td>
                    <td>{rec.diagnosis}</td>
                    <td style={{ maxWidth: '250px' }}>{rec.prescription || '—'}</td>
                    <td>{rec.recordDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>
                    No medical records recorded yet.
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
              <h3>Create Medical Record</h3>
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
                <label className="form-label">Attending Doctor *</label>
                <select
                  className="select"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis *</label>
                <textarea
                  className="textarea"
                  rows="2"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes Mellitus"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription</label>
                <textarea
                  className="textarea"
                  rows="3"
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  placeholder="e.g. Metformin 500mg twice daily with meals."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Doctor Notes</label>
                <textarea
                  className="textarea"
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Follow up in 4 weeks."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
