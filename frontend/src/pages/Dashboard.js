import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // ถ้า user ไม่มี หรือไม่ใช่ admin ให้แสดงข้อความหรือซ่อนเนื้อหา
  if (!user || user.role !== 'admin') {
    return <p style={{ padding: '1.5rem', color: '#888' }}>เฉพาะผู้ดูแลระบบเท่านั้น</p>;
  }

  const mockBookings = [12, 8, 15, 10, 14, 9, 13];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Dashboard (Admin)</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { title: 'ยอดจองวันนี้', value: '12', color: '#06b6d4' },
          { title: 'รายได้รวม', value: '฿ 14,500', color: '#4f46e5' },
          { title: 'รถให้บริการ', value: '6', color: '#06b6d4' },
          { title: 'รีวิวลูกค้า', value: '4.8 ★', color: '#fbbf24' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              flex: '1 1 180px',
              background: '#fff',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px #eee',
              minWidth: 160,
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontSize: '2rem', color: card.color, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>กราฟยอดจอง (Mockup)</h3>
        <div
          style={{
            height: '150px',
            width: '100%',
            background: 'linear-gradient(90deg,#06b6d4,#4f46e5)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 2%',
          }}
        >
          {mockBookings.map((val, i) => (
            <div
              key={i}
              style={{
                width: `${100 / mockBookings.length - 4}%`,
                height: `${val * 7}px`,
                background: '#fff',
                borderRadius: '4px 4px 0 0',
                boxShadow: '0 2px 8px #ddd',
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
