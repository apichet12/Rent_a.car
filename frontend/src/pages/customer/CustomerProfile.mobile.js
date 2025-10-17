import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerProfileMobile = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div style={centerCard}>กำลังโหลด...</div>;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {/* Avatar */}
      <div onClick={() => setOpen(!open)} style={avatarStyle}>
        {user.username?.charAt(0).toUpperCase() || 'U'}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={dropdownStyle}>
          <div style={dropdownHeader}>
            <div style={{ ...textEllipsis, fontSize: 16, fontWeight: 600 }}>{user.username}</div>
            <div style={{ ...textEllipsis, fontSize: 12, marginBottom: 6 }}>{user.email || '-'}</div>
          </div>

          <div style={divider} />

          <div style={menuContainerStyle}>
            <MenuItem label="แก้ไขโปรไฟล์" onClick={() => navigate('/customer/edit-profile')} />
            <MenuItem label="ข้อความและออเดอร์" onClick={() => navigate('/customer/bookings')} />
            <MenuItem label="คูปองส่วนลด" />
            <MenuItem label="งานที่ชอบ" />
            <MenuItem label="ออกจากระบบ" onClick={() => { logout(); navigate('/'); }} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== Styles ====================
const centerCard = { textAlign: 'center', padding: 32 };
const avatarStyle = {
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: '#3b82f6',
  color: '#fff',
  fontWeight: '500',
  fontSize: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  margin: '10px auto',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
};
const dropdownStyle = {
  position: 'absolute',
  top: 60,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: 320,
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  padding: 12,
  zIndex: 1000,
};
const dropdownHeader = { padding: '6px 0', textAlign: 'center' };
const divider = { height: 1, background: '#e2e8f0', margin: '6px 0' };
const textEllipsis = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const menuContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 300,
  overflowY: 'auto',
  paddingRight: 4,
};

const MenuItem = ({ label, value, badge, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      cursor: 'pointer',
      color: '#111',
      fontSize: 14,
      fontWeight: 500,
      borderRadius: 8,
      transition: 'all 0.2s',
      marginBottom: 4,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f0f0f0';
      e.currentTarget.style.transform = 'translateX(2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.transform = 'translateX(0)';
    }}
  >
    <span>{label}</span>
    {value && <span>{value}</span>}
    {badge && <span style={{ background: '#000', color: '#fff', borderRadius: 12, padding: '2px 6px', fontSize: 10 }}>{badge}</span>}
  </div>
);

export default CustomerProfileMobile;
