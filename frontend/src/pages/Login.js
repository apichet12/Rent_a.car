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
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 1000 }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {/* Left hero with logo and description */}
          <div style={{ flex: '1 1 360px', minWidth: 300, padding: 28, borderRadius: 12, background: 'linear-gradient(180deg,#f0fbff,#eef6ff)', boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
            <div style={{ textAlign: 'left' }}>
              <img src="/logo192.png" alt="logo" style={{ width: 120, marginBottom: 12 }} />
              <h1 style={{ margin: 0, marginTop: 6, fontSize: 26, color: '#07203a' }}>ยินดีต้อนรับสู่ Drivehub</h1>
              <p style={{ color: '#475569', marginTop: 8 }}>เข้าสู่ระบบสมาชิกติดตามสถานะกับเราได้ง่ายกว่า</p>

              <div style={{ marginTop: 20 }}>
                <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={() => alert('Login via email not implemented')}>📧 อีเมล</button>
                <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={() => alert('Login via phone not implemented')}>📞 เบอร์โทรศัพท์</button>
                <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={async () => {
                  try {
                    const r = await fetch('/auth/facebook');
                    const j = await r.json();
                    alert(j.message || 'Facebook login not configured');
                  } catch (e) { alert('Facebook login error'); }
                }}>🔵 เข้าสู่ระบบด้วย Facebook</button>
                <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8 }} onClick={async () => {
                  try {
                    const r = await fetch('/auth/google');
                    const j = await r.json();
                    alert(j.message || 'Google login not configured');
                  } catch (e) { alert('Google login error'); }
                }}>🔴 เข้าสู่ระบบด้วย Google</button>
              </div>

            </div>
          </div>

          {/* Right: form */}
          <div style={{ flex: '1 1 420px', minWidth: 300, padding: 28, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
            <h2 style={{ color: '#07203a', fontWeight: 800, marginBottom: 6 }}>เข้าสู่ระบบ</h2>
            <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 18 }}>กรุณาเข้าสู่ระบบเพื่อจัดการการจองหรือดูรายละเอียดรถ</p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              {error && (
                <div style={{ background: '#fff1f2', color: '#991b1b', padding: '10px 12px', borderRadius: 8, fontSize: 14 }}>{error}</div>
              )}

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="user" /></div>
                <input className="nice-input" name="username" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required autoComplete="username" style={{ paddingLeft: 40 }} />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="lock" /></div>
                <input className="nice-input" name="password" type="password" placeholder="รหัสผ่าน / Password" value={form.password} onChange={handleChange} required autoComplete="current-password" style={{ paddingLeft: 40 }} />
              </div>

              <button type="submit" className="btn-primary" disabled={!form.username || !form.password} style={{ marginTop: 6, fontWeight: 800 }}>เข้าสู่ระบบ</button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, color: '#475569' }}>
              ยังไม่มีบัญชี? <a href="/register" style={{ color: '#06b6d4', fontWeight: 700, textDecoration: 'none' }}>สมัครสมาชิกใหม่ฟรี!</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
