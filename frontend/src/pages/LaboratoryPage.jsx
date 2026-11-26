import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function LaboratoryPage() {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    testName: '',
    testCategory: 'Blood Test',
    cost: '2500.00',
    resultNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [labRes, patRes, docRes] = await Promise.all([
        API.get('/lab-tests'),
        API.get('/patients'),
        API.get('/doctors')
      ]);
      setLabTests(labRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      setError('Failed to fetch laboratory tests.');
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
      testName: '',
      testCategory: 'Blood Test',
      cost: '2500.00',
      resultNotes: ''
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
      await API.post('/lab-tests', formData);
      setSuccess('Lab test requested successfully!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error requesting lab test.');
    }
  };

  const handleCompleteTest = async (id) => {
    const notes = prompt('Enter test results / notes:');
    if (notes === null) return;
    setError('');
    setSuccess('');

    try {
      await API.patch(`/lab-tests/${id}/result?status=COMPLETED`, notes, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setSuccess('Lab test result recorded!');
      fetchData();
    } catch (err) {
      setError('Failed to record test result.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test request?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/lab-tests/${id}`);
      setSuccess('Test request deleted.');
      fetchData();
    } catch (err) {
      setError('Failed to delete lab test.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Laboratory Management</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + Request Lab Test
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Patient</th>
                <th>Ordering Doctor</th>
                <th>Test Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Result Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>Loading lab tests...</td>
                </tr>
              ) : labTests.length > 0 ? (
                labTests.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td style={{ fontWeight: 600 }}>{t.patientName}</td>
                    <td>{t.doctorName}</td>
                    <td style={{ fontWeight: 500 }}>{t.testName}</td>
                    <td><span className="user-badge">{t.testCategory}</span></td>
                    <td>LKR {t.cost}</td>
                    <td>
                      <span className={`badge ${t.status === 'COMPLETED' ? 'badge-completed' : 'badge-scheduled'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.resultNotes || 'Pending...'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {t.status === 'REQUESTED' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCompleteTest(t.id)}
                          style={{ marginRight: '6px' }}
                        >
                          Add Result 🧪
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: '#64748b' }}>
                    No lab tests requested yet.
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
              <h3>Request Laboratory Test</h3>
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
                <label className="form-label">Ordering Doctor *</label>
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
                <label className="form-label">Test Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  placeholder="e.g. Full Blood Count (FBC)"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="select"
                    value={formData.testCategory}
                    onChange={(e) => setFormData({ ...formData, testCategory: e.target.value })}
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="Urine Analysis">Urine Analysis</option>
                    <option value="Radiology / X-Ray">Radiology / X-Ray</option>
                    <option value="MRI / CT Scan">MRI / CT Scan</option>
                    <option value="ECG / Cardiology">ECG / Cardiology</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cost (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
