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
  const [usePhone, setUsePhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    
    try {
      // If using phone flow, ensure phone verified
      if (usePhone && !verifiedPhone) {
        setError('กรุณายืนยันหมายเลขโทรศัพท์ด้วย OTP ก่อนสมัคร');
        return;
      }
      const res = await fetch('/api/register', {
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

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
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

  const handleSendOtp = async () => {
    setError('');
    const phone = (form.phone || '').toString().trim();
    if (!phone) return setError('กรุณาระบุหมายเลขโทรศัพท์');
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: form.phone }) });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.code) alert('OTP (dev): ' + data.code);
      } else {
        setError(data.message || `ส่ง OTP ล้มเหลว (status ${res.status})`);
      }
    } catch (e) { setError('เกิดข้อผิดพลาดในการส่ง OTP'); }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const phone = (form.phone || '').toString().trim();
    const code = (otpCode || '').toString().trim();
    if (!phone || !code) return setError('กรุณากรอกหมายเลขและรหัส OTP');
    try {
      const res = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifiedPhone(phone);
        alert('ยืนยันหมายเลขเรียบร้อย');
      } else {
        setError(data.message || `การยืนยันล้มเหลว (status ${res.status})`);
      }
    } catch (e) { setError('เกิดข้อผิดพลาดในการยืนยัน OTP'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 980 }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 360px', minWidth: 300, padding: 28, borderRadius: 12, background: 'linear-gradient(180deg,#fff,#f6fcff)', boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
            <img src="/logo192.png" alt="logo" style={{ width: 140, marginBottom: 10 }} />
            <h2 style={{ marginTop: 6, color: '#07203a' }}>สมัครสมาชิกใหม่</h2>
            <p style={{ color: '#6b7280' }}>เข้าสู่ระบบได้รวดเร็ว และจองรถได้ทันที</p>
            <div style={{ marginTop: 18 }}>
              <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={() => alert('สมัครด้วยเบอร์โทรศัพท์ยังไม่รองรับ')}>📞 สมัครด้วยเบอร์โทรศัพท์</button>
              <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 8 }} onClick={async () => {
                try {
                  const r = await fetch('/auth/google');
                  const j = await r.json();
                  alert(j.message || 'Social login not configured');
                } catch (e) { alert('Social login error'); }
              }}>🔵 สมัครด้วย Facebook / Google</button>
            </div>
          </div>

          <div style={{ flex: '1 1 360px', minWidth: 300, padding: 28, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
            <h2 style={{ color: '#07203a', marginBottom: 12 }}>แบบฟอร์มสมัครสมาชิก</h2>
            {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>สมัครด้วย {usePhone ? 'เบอร์โทรศัพท์' : 'อีเมล'}</strong>
                <button className="btn-link" onClick={() => setUsePhone(p => !p)}>{usePhone ? 'ใช้แบบอีเมล' : 'ใช้แบบเบอร์โทร'}</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group"><input className="nice-input" name="username" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required /></div>
                {!usePhone && <div className="form-group"><input className="nice-input" name="email" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required /></div>}
                <div className="form-group"><input className="nice-input" name="name" placeholder="ชื่อ-สกุล (ไม่บังคับ)" value={form.name} onChange={handleChange} /></div>
                <div className="form-group" style={{ display: 'flex', gap: 8 }}>
                  <input className="nice-input" name="phone" placeholder="โทรศัพท์" value={form.phone} onChange={handleChange} required={usePhone} />
                  {usePhone && <div style={{ display: 'flex', gap: 8 }}>
                    {!otpSent ? (
                      <button type="button" className="btn-outline" onClick={handleSendOtp}>ส่ง OTP</button>
                    ) : (
                      <>
                        <input className="nice-input" placeholder="รหัส OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                        <button type="button" className="btn-outline" onClick={handleVerifyOtp}>ยืนยัน OTP</button>
                      </>
                    )}
                  </div>}
                </div>

                <div className="form-group"><input className="nice-input" name="password" type="password" placeholder="รหัสผ่าน" value={form.password} onChange={handleChange} required /></div>
                <div className="form-group"><input className="nice-input" name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" value={form.confirmPassword} onChange={handleChange} required /></div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 16, fontWeight: 700 }}>สมัครสมาชิก</button>
              </form>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              มีบัญชีแล้ว? <a href="/login" style={{ color: '#06b6d4', fontWeight: 700 }}>เข้าสู่ระบบ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
