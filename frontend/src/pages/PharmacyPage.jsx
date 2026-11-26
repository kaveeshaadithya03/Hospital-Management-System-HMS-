import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Antibiotic',
    unitPrice: '50.00',
    stockQuantity: '100',
    reorderLevel: '20',
    expiryDate: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      setError('Failed to fetch medicine inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (med = null) => {
    setError('');
    setSuccess('');
    if (med) {
      setEditingId(med.id);
      setFormData({
        name: med.name,
        category: med.category,
        unitPrice: med.unitPrice,
        stockQuantity: med.stockQuantity,
        reorderLevel: med.reorderLevel,
        expiryDate: med.expiryDate || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Antibiotic',
        unitPrice: '50.00',
        stockQuantity: '100',
        reorderLevel: '20',
        expiryDate: ''
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
        await API.put(`/medicines/${editingId}`, formData);
        setSuccess('Medicine details updated!');
      } else {
        await API.post('/medicines', formData);
        setSuccess('Medicine added to inventory!');
      }
      handleCloseModal();
      fetchMedicines();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving medicine.');
    }
  };

  const handleStockUpdate = async (id, change) => {
    setError('');
    setSuccess('');
    try {
      await API.patch(`/medicines/${id}/stock?change=${change}`);
      setSuccess('Stock quantity updated.');
      fetchMedicines();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/medicines/${id}`);
      setSuccess('Medicine removed from inventory.');
      fetchMedicines();
    } catch (err) {
      setError('Failed to remove medicine.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pharmacy & Stock Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Medicine
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
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Stock Quantity</th>
                <th>Reorder Level</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>Loading pharmacy inventory...</td>
                </tr>
              ) : medicines.length > 0 ? (
                medicines.map((med) => (
                  <tr key={med.id}>
                    <td>#{med.id}</td>
                    <td style={{ fontWeight: 600 }}>{med.name}</td>
                    <td>{med.category}</td>
                    <td>LKR {med.unitPrice}</td>
                    <td style={{ fontWeight: 700 }}>
                      {med.stockQuantity}
                    </td>
                    <td>{med.reorderLevel}</td>
                    <td>{med.expiryDate || '—'}</td>
                    <td>
                      {med.lowStock ? (
                        <span className="badge badge-cancelled">⚠️ LOW STOCK</span>
                      ) : (
                        <span className="badge badge-completed">IN STOCK</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleStockUpdate(med.id, 50)}
                        style={{ marginRight: '4px' }}
                      >
                        +50 Stock
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenModal(med)}
                        style={{ marginRight: '4px' }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(med.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: '#64748b' }}>
                    No medicines in inventory yet.
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
              <h3>{editingId ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic / Painkiller">Analgesic / Painkiller</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Supplement / Vitamin">Supplement / Vitamin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Price (LKR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reorder Level Alert *</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save Medicine'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
