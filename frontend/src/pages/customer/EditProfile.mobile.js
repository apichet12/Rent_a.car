// src/pages/customer/EditProfile.mobile.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MobileNav from '../../components/mobile/MobileNav';

const EditProfileMobile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        navigate('/customer/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mobile-edit-profile" style={{ paddingBottom: 64 }}>
      <h2 style={{ padding: 16 }}>แก้ไขโปรไฟล์</h2>
      <form onSubmit={handleSubmit} style={{ padding: 16 }}>
        <label>ชื่อผู้ใช้</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, margin: '8px 0', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, margin: '8px 0', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 700 }}>
          บันทึก
        </button>
      </form>
      <MobileNav />
    </div>
  );
};

export default EditProfileMobile;
