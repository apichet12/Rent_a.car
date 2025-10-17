import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', name: '' });
  const [error, setError] = useState('');
  const [wantsOffers, setWantsOffers] = useState(true);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const payload = {
        username: form.username,
        password: form.password,
        name: form.name || null,
        email: form.email || null
      };

      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message || 'สมัครสมาชิกสำเร็จ');
        navigate('/');
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
      }
    } catch (err) {
      console.error('Register fetch error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24, minHeight: '100vh', background: '#f9fafb' }}>
      <div className="auth-card">
        <div className="auth-left">
          <img src="/logo192.png" alt="logo" style={{ width: 120, display: 'block', margin: '0 auto' }} />
          <h3 style={{ color: '#07203a', textAlign: 'center', marginTop: 8 }}>ข้อดีของบริการเรา</h3>
          <div className="advantages">
            {advantagesWithIcons.map((adv, i) => (
              <div key={i} className="adv-item">
                <div className="adv-icon">{adv.icon}</div>
                <div style={{ fontWeight: 600 }}>{adv.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-right">
          <h2 style={{ color: '#07203a', marginBottom: 12, textAlign: 'center' }}>แบบฟอร์มสมัครสมาชิก</h2>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <input name="username" className="nice-input" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required />
            <input name="email" className="nice-input" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required />
            <input name="name" className="nice-input" placeholder="ชื่อ-สกุล (ไม่บังคับ)" value={form.name} onChange={handleChange} />

            <input name="password" className="nice-input" type="password" placeholder="รหัสผ่าน" value={form.password} onChange={handleChange} required />
            <input name="confirmPassword" className="nice-input" type="password" placeholder="ยืนยันรหัสผ่าน" value={form.confirmPassword} onChange={handleChange} required />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div role="button" tabIndex={0} className={`toggle-circle ${wantsOffers ? 'on' : ''}`} onClick={() => setWantsOffers(v => !v)} onKeyDown={() => setWantsOffers(v => !v)}>{wantsOffers ? '✓' : ''}</div>
              <div>ตกลงรับข่าวสารและข้อเสนอพิเศษ</div>
            </label>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, borderRadius: 8, fontWeight: 700 }}>สมัครสมาชิก</button>
          </form>

          <div style={{ marginTop: 16, width: '100%' }}>
            <p style={{ color: '#6b7280', marginBottom: 12, textAlign: 'center' }}>หรือสมัครด้วย</p>
            <button className="social-btn" style={{ marginBottom: 10 }} onClick={() => alert('สมัครด้วย Facebook')}>🔵 Facebook</button>
            <button className="social-btn" onClick={() => alert('สมัครด้วย Google')}>🟢 Google</button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>มีบัญชีแล้ว? <a href="/login" className="small-link">เข้าสู่ระบบ</a></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
