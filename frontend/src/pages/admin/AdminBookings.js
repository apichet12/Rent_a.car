import React from 'react';

const AdminBookings = () => {
  const bookings = [
    { id: 1, user: 'Somchai', car: 'Honda Civic', date: '2025-10-01' },
    { id: 2, user: 'Suda', car: 'Toyota Yaris', date: '2025-10-05' }
  ];

  return (
    <div className="page-card">
      <h2>Bookings</h2>
      <div style={{ marginTop: 12 }}>
        {bookings.map(b => (
          <div key={b.id} style={{ background: '#fff', padding: 12, borderRadius: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{b.user} — {b.car}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{b.date}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
