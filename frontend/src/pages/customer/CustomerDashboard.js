import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <div className="page-card">
      <h2>Welcome back</h2>
      <p style={{ color: '#6b7280' }}>Quick links for your bookings and profile.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <Link to="/customer/bookings" className="btn-primary">My Bookings</Link>
        <Link to="/customer/profile" className="btn-ghost">Profile</Link>
        <Link to="/carlist" className="btn-ghost">Browse Cars</Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
