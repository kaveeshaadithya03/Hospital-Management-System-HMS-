import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    consultationFee: '1500.00',
    labFee: '0.00',
    medicineFee: '0.00',
    paymentStatus: 'PENDING',
    paymentMethod: 'CASH'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billRes, patRes] = await Promise.all([
        API.get('/bills'),
        API.get('/patients')
      ]);
      setBills(billRes.data);
      setPatients(patRes.data);
    } catch (err) {
      setError('Failed to fetch billing data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setSuccess('');
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      consultationFee: '1500.00',
      labFee: '0.00',
      medicineFee: '0.00',
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH'
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
      await API.post('/bills', formData);
      setSuccess('Invoice generated successfully!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating bill.');
    }
  };

  const handlePay = async (id, method) => {
    setError('');
    setSuccess('');
    try {
      await API.patch(`/bills/${id}/pay?status=PAID&method=${method}`);
      setSuccess(`Bill #${id} marked as PAID via ${method}.`);
      fetchData();
    } catch (err) {
      setError('Failed to update payment status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/bills/${id}`);
      setSuccess('Bill deleted successfully.');
      fetchData();
    } catch (err) {
      setError('Failed to delete bill.');
    }
  };

  const handlePrintReceipt = (bill) => {
    setSelectedReceipt(bill);
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Billing & Payments</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          + Create Invoice
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Patient</th>
                <th>NIC</th>
                <th>Consultation</th>
                <th>Lab Charges</th>
                <th>Medicine</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>Loading billing records...</td>
                </tr>
              ) : bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>#{bill.id}</td>
                    <td style={{ fontWeight: 600 }}>{bill.patientName}</td>
                    <td>{bill.patientNic}</td>
                    <td>LKR {bill.consultationFee}</td>
                    <td>LKR {bill.labFee}</td>
                    <td>LKR {bill.medicineFee}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>LKR {bill.totalAmount}</td>
                    <td>
                      <span className={`badge ${bill.paymentStatus === 'PAID' ? 'badge-completed' : 'badge-scheduled'}`}>
                        {bill.paymentStatus} {bill.paymentMethod ? `(${bill.paymentMethod})` : ''}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handlePrintReceipt(bill)}
                        style={{ marginRight: '6px' }}
                      >
                        Print Receipt 🖨️
                      </button>
                      {bill.paymentStatus === 'PENDING' && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handlePay(bill.id, 'CASH')}
                            style={{ marginRight: '6px' }}
                          >
                            Pay Cash 💵
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handlePay(bill.id, 'CARD')}
                            style={{ marginRight: '6px' }}
                          >
                            Pay Card 💳
                          </button>
                        </>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bill.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: '#64748b' }}>
                    No invoices generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Generate Invoice</h3>
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
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} (NIC: {p.nic})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lab Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.labFee}
                    onChange={(e) => setFormData({ ...formData, labFee: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medicine Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.medicineFee}
                    onChange={(e) => setFormData({ ...formData, medicineFee: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="select"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="CASH">CASH</option>
                    <option value="CARD">CARD</option>
                    <option value="INSURANCE">INSURANCE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-overlay">
          <div className="modal-content printable-receipt" style={{ maxWidth: '600px' }}>
            <div className="modal-header no-print">
              <h3>Official Payment Receipt</h3>
              <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ border: '2px solid #e2e8f0', padding: '24px', borderRadius: '8px', backgroundColor: '#fff' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>🏥 Hospital Management System</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>123 Healthcare Ave, Colombo 03 • Tel: 011-2345678</p>
                <h3 style={{ marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#2563eb' }}>PAYMENT RECEIPT</h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
                <div>
                  <p><strong>Receipt No:</strong> #{selectedReceipt.id}</p>
                  <p><strong>Patient:</strong> {selectedReceipt.patientName}</p>
                  <p><strong>Patient NIC:</strong> {selectedReceipt.patientNic}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Date:</strong> {selectedReceipt.billDate}</p>
                  <p><strong>Payment Status:</strong> <span style={{ color: selectedReceipt.paymentStatus === 'PAID' ? '#16a34a' : '#d97706', fontWeight: 700 }}>{selectedReceipt.paymentStatus}</span></p>
                  <p><strong>Payment Method:</strong> {selectedReceipt.paymentMethod || '—'}</p>
                </div>
              </div>

              <table className="table" style={{ marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Doctor Consultation Fee</td>
                    <td style={{ textAlign: 'right' }}>LKR {selectedReceipt.consultationFee}</td>
                  </tr>
                  <tr>
                    <td>Laboratory Charges</td>
                    <td style={{ textAlign: 'right' }}>LKR {selectedReceipt.labFee}</td>
                  </tr>
                  <tr>
                    <td>Pharmacy & Medicine Charges</td>
                    <td style={{ textAlign: 'right' }}>LKR {selectedReceipt.medicineFee}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #1e293b', paddingTop: '12px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>TOTAL AMOUNT:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb' }}>LKR {selectedReceipt.totalAmount}</span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#94a3b8' }}>
                Thank you for choosing Hospital HMS. Get well soon!
              </div>
            </div>

            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReceipt(null)}>Close</button>
              <button className="btn btn-primary" onClick={triggerBrowserPrint}>
                Print / Save PDF 🖨️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
