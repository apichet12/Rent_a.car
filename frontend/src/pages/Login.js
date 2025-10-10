import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Icon = ({ name }) => {
  if (name === 'user') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 
      2.239-5 5 2.239 5 5 5z" 
      stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 
      2.686 6 6" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'lock') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.2"/>
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("กรุณากรอก username และ password");
      return;
    }

    try {
      console.log("Submitting login", form);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("Response received:", res);

      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error Response:", text);
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        login(data.user.username, data.user.role);
        navigate("/dashboard");
      } else {
        setError(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (ตรวจสอบ server หรือ URL)");
    }
  };

  return (
    <div className="page-card" style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Sidebar Logo */}
        <div style={{
          flex: '1 1 360px',
          minWidth: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.25rem',
          background: 'linear-gradient(180deg,#eef8ff,#f3f8ff)',
          borderRadius: 12,
          marginBottom: 16,
        }}>
          <div style={{ textAlign: 'center' }}>
            <img src="/logo192.png" alt="RentWheels" style={{ width: 220, marginBottom: 14 }} />
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 18 }}>RentWheels</div>
            <div style={{ color: '#475569', fontSize: 13 }}>Your journey starts here</div>
          </div>
        </div>

        {/* Login Form */}
        <div style={{ flex: '1 1 420px', minWidth: 300, padding: '2.25rem' }}>
          <h2 style={{ color: '#0f172a', fontWeight: 800, marginBottom: 6 }}>เข้าสู่ระบบ</h2>
          <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 18 }}>
            กรุณาเข้าสู่ระบบเพื่อจัดการการจองของคุณ
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 14
              }}>
                {error}
              </div>
            )}

            {/* Username */}
            <div className="form-group input-icon">
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <Icon name="user" />
              </div>
              <input
                className="nice-input"
                name="username"
                placeholder="ชื่อผู้ใช้ / Username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="form-group input-icon">
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <Icon name="lock" />
              </div>
              <input
                className="nice-input"
                name="password"
                type="password"
                placeholder="รหัสผ่าน / Password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!form.username || !form.password}
              style={{ marginTop: 6, opacity: (!form.username || !form.password) ? 0.75 : 1 }}
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16, color: '#475569' }}>
            ยังไม่มีบัญชี? <a href="/register" style={{ color: '#06b6d4', fontWeight: 700, textDecoration: 'none' }}>สมัครสมาชิก</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
