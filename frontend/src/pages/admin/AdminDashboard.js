import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // sample metrics (would come from API normally)
  const metrics = [
    { label: 'Total Cars', value: 42 },
    { label: 'Active Bookings', value: 17 },
    { label: 'Pending Requests', value: 3 },
    { label: 'Users', value: 128 }
  ];

  return (
    <div className="page-card">
      <h2 style={{ marginBottom: 12 }}>Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: 18 }}>Overview of system metrics and quick actions.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{m.value}</div>
            <div style={{ color: '#6b7280', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/cars" className="btn-primary">Manage Cars</Link>
        <Link to="/admin/bookings" className="btn-ghost">View Bookings</Link>
        <Link to="/carlist" className="btn-ghost">Browse Site</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
