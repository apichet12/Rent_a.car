import React from 'react';

export default function LoadingOverlay({ message = 'กำลังค้นหา...', visible = true }) {
  if (!visible) return null;

  const steps = [
    'กำลังตรวจสอบรถทั้งหมด',
    'เลือกประเภทและราคาเหมาะสม',
    'กำลังจัดลำดับและแสดงผล'
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,23,42,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        minWidth: 280
      }}>
        {/* 🔄 วงกลมหมุน + แว่นขยาย */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg,#06b6d4,#4f46e5)',
          color: '#fff',
          animation: 'spin 1.2s linear infinite'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>

        {/* ข้อความหลัก */}
        <div style={{ fontWeight: 700, fontSize: 16 }}>{message}</div>
        <div style={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>รอสักครู่ ระบบกำลังค้นหารถที่เหมาะสม</div>

        {/* ✅ ขั้นตอน 3 ข้อ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, alignItems: 'flex-start' }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid #4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                backgroundColor: idx === 0 ? '#4f46e5' : 'transparent',
                transition: 'all 0.3s'
              }}>
                {idx === 0 && '✓'}
              </div>
              <span style={{ fontSize: 13, color: '#374151' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>
    </div>
  );
}
