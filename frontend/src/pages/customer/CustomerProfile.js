import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const CustomerProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="page-card" style={{ textAlign: 'center', padding: 32 }}><h2>กรุณาเข้าสู่ระบบ</h2></div>;
  }

  return (
    <div className="page-card" style={{ maxWidth: 500, margin: '0 auto', background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)', boxShadow: '0 4px 24px #e0e7ef', borderRadius: 18, padding: 32 }}>
      <h2 style={{ color: '#1e293b', marginBottom: 0 }}>โปรไฟล์ผู้ใช้</h2>
      <div style={{ marginTop: 18 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 14, boxShadow: '0 2px 8px #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{user.username || user.name || '-'}</div>
          <div style={{ color: '#64748b', fontSize: 15 }}>อีเมล: {user.email || '-'}</div>
          {user.phone && <div style={{ color: '#64748b', fontSize: 15 }}>โทร: {user.phone}</div>}
          <div style={{ color: '#64748b', fontSize: 15 }}>สถานะ: <span style={{ color: user.role === 'admin' ? '#0ea5e9' : '#22c55e', fontWeight: 600 }}>{user.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
