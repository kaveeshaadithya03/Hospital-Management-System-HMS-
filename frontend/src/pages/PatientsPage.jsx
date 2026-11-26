import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      setError('Failed to fetch patients list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPatients();
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/patients/search?query=${encodeURIComponent(searchQuery)}`);
      setPatients(res.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (patient = null) => {
    setError('');
    setSuccess('');
    if (patient) {
      setEditingId(patient.id);
      setFormData({
        fullName: patient.fullName,
        nic: patient.nic,
        dob: patient.dob || '',
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || '',
        address: patient.address || '',
        bloodGroup: patient.bloodGroup || 'O+'
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        nic: '',
        dob: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        bloodGroup: 'O+'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await API.put(`/patients/${editingId}`, formData);
        setSuccess('Patient details updated successfully!');
      } else {
        await API.post('/patients', formData);
        setSuccess('Patient registered successfully!');
      }
      handleCloseModal();
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving patient.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/patients/${id}`);
      setSuccess('Patient deleted successfully.');
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete patient.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Register Patient
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="input"
            placeholder="Search by Patient Name or NIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
          <button type="submit" className="btn btn-secondary">Search 🔍</button>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setSearchQuery(''); fetchPatients(); }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>NIC</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Loading patients...</td>
                </tr>
              ) : patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.fullName}</td>
                    <td>{p.nic}</td>
                    <td>{p.gender}</td>
                    <td>{p.phone}</td>
                    <td><span className="user-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{p.bloodGroup || 'N/A'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(p)} style={{ marginRight: '8px' }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>
                    No patient records found.
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
              <h3>{editingId ? 'Edit Patient' : 'Register Patient'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NIC (National Identity Card) *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    className="select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Phone * (10 digits)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="select"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="textarea"
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
