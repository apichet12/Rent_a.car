import React from 'react';

const CustomerBookings = () => {
  const bookings = [
    { id: 1, car: 'Honda Civic', start: '2025-10-01', end: '2025-10-04' },
    { id: 2, car: 'Toyota Yaris', start: '2025-11-10', end: '2025-11-12' }
  ];

  return (
    <div className="page-card">
      <h2>My Bookings</h2>
      <div style={{ marginTop: 12 }}>
        {bookings.map(b => (
          <div key={b.id} style={{ background: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{b.car}</div>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{b.start} → {b.end}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerBookings;
