import React from 'react';

export default function LoadingOverlay({ message = 'กำลังค้นหา...', visible = true }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 220 }}>
        <div style={{ width: 56, height: 56, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg,#06b6d4,#4f46e5)', color: '#fff' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div style={{ fontWeight: 700 }}>{message}</div>
        <div style={{ fontSize: 13, color: '#475569' }}>รอสักครู่ ระบบกำลังค้นหารถที่เหมาะสม</div>
      </div>
    </div>
  );
}
