import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบ password confirm
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    // ใช้ IP ของเครื่องแทน localhost เพื่อให้มือถือเข้าถึงได้
const SERVER_URL = "http://192.168.100.24/carrental/api/register.php";

    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone
        })
      });

      // รับ response เป็น text ก่อน
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text); // พยายาม parse เป็น JSON
      } catch (err) {
        console.error('Response is not JSON:', text);
        setError('เกิดข้อผิดพลาดจาก server (ไม่ใช่ JSON)');
        return;
      }

      if (data.success) {
        alert(data.message || 'สมัครสมาชิกสำเร็จ');
        navigate('/login');
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
      }

    } catch (err) {
      console.error('Network error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 960, margin: '3rem auto', background: 'linear-gradient(180deg,#ffffff,#f8fafc)', borderRadius: 16, boxShadow: '0 12px 48px rgba(2,6,23,0.08)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 320px', minWidth: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(90deg,#f0f9ff,#eef2ff)', borderRadius: 12 }}>
          <img src="/logo192.png" alt="RentWheels logo" style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: 420, maxHeight: 320 }} />
        </div>

        <div style={{ flex: '1 1 320px', minWidth: 280, padding: '2rem' }}>
          <h2 style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '1rem' }}>สมัครสมาชิก / Register</h2>
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input name="username" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <input name="email" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <input name="name" placeholder="ชื่อ-สกุล (ไม่บังคับ)" value={form.name} onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <input name="phone" placeholder="โทรศัพท์ (ไม่บังคับ)" value={form.phone} onChange={handleChange} style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <input name="password" type="password" placeholder="รหัสผ่าน / Password" value={form.password} onChange={handleChange} required style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <input name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน / Confirm Password" value={form.confirmPassword} onChange={handleChange} required style={{ width: '100%', margin: '8px 0', padding: '12px', borderRadius: '8px', border: '1px solid #e6eefc' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg,#06b6d4,#4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '16px', fontWeight: 'bold', fontSize: '1.05rem' }}>สมัครสมาชิก</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span style={{ color: '#555' }}>มีบัญชีแล้ว?</span>
            <a href="/login" style={{ marginLeft: '8px', color: '#06b6d4', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.05rem' }}>เข้าสู่ระบบ</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
