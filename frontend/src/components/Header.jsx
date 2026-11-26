import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBadgeStyle = (role) => {
    const r = role?.toUpperCase();
    if (r === 'ADMIN') return { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' };
    if (r === 'DOCTOR') return { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
    if (r === 'RECEPTIONIST') return { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
    return { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  return (
    <header className="header">
      <div style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Hospital Management Portal</span>
      </div>

      <div className="header-user">
        {user && (
          <>
            <span style={{ fontWeight: 600 }}>{user.fullName || user.username}</span>
            <span className="user-badge" style={getBadgeStyle(user.role)}>
              {user.role}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout 🚪
            </button>
          </>
        )}
      </div>
    </header>
  );
}
