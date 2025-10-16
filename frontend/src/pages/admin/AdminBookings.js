import React from 'react';

const AdminBookings = ({ bookings = [] }) => { // กำหนด default เป็น []
  return (
    <div className="page-card">
      <h2>การจองรถ</h2>
      <div style={{ marginTop: 12 }}>
        {bookings.length ? bookings.map(b => (
          <div 
            key={b.id} 
            style={{ 
              background: '#fff', 
              padding: 12, 
              borderRadius: 10, 
              marginBottom: 8, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{b.user} — {b.car}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>วันที่จอง: {b.date}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost">รายละเอียด</button>
            </div>
          </div>
        )) : (
          <div style={{ color: '#6b7280', fontSize: 14 }}>ยังไม่มีการจอง</div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
