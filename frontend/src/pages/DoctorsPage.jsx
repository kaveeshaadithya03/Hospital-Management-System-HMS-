import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    phone: '',
    email: '',
    departmentId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/departments')
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      setError('Failed to fetch doctor details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    setError('');
    setSuccess('');
    if (doctor) {
      setEditingId(doctor.id);
      setFormData({
        fullName: doctor.fullName,
        specialization: doctor.specialization,
        phone: doctor.phone,
        email: doctor.email || '',
        departmentId: doctor.departmentId
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        specialization: '',
        phone: '',
        email: '',
        departmentId: departments.length > 0 ? departments[0].id : ''
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
        await API.put(`/doctors/${editingId}`, formData);
        setSuccess('Doctor details updated successfully!');
      } else {
        await API.post('/doctors', formData);
        setSuccess('Doctor registered successfully!');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving doctor record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/doctors/${id}`);
      setSuccess('Doctor removed successfully.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete doctor.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Doctor
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Email</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Loading doctors...</td>
                </tr>
              ) : doctors.length > 0 ? (
                doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>#{doc.id}</td>
                    <td style={{ fontWeight: 600 }}>{doc.fullName}</td>
                    <td>{doc.specialization}</td>
                    <td><span className="user-badge">{doc.departmentName || '—'}</span></td>
                    <td>{doc.phone}</td>
                    <td>{doc.email || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(doc)} style={{ marginRight: '8px' }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>
                    No doctors registered yet.
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
              <h3>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h3>
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
                <label className="form-label">Specialization *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Cardiologist"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="select"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number * (10 digits)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0771234567"
                  required
                />
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
