import React from 'react';

const CustomerProfile = () => {
  const user = { name: 'Somsri', email: 'somsri@example.com', phone: '081-234-5678' };

  return (
    <div className="page-card">
      <h2>Profile</h2>
      <div style={{ marginTop: 12 }}>
        <div style={{ background: '#fff', padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>{user.email}</div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>{user.phone}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
