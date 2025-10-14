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
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', name: '', phone: '' });
  const [usePhone, setUsePhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
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
  if (usePhone && !verifiedPhone) {
    setError('กรุณายืนยันหมายเลขโทรศัพท์ด้วย OTP ก่อนสมัคร');
    return;
  }

  try {
    const payload = {
      username: form.username,
      password: form.password,
      name: form.name || null,
      email: usePhone ? null : form.email || null,
      phone: usePhone ? form.phone : null
    };

    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      alert(data.message || 'สมัครสมาชิกสำเร็จ');
      navigate('/login');
    } else {
      setError(data.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
    }
  } catch (err) {
    console.error('Register fetch error:', err);
    setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  }
};


  const handleSendOtp = async () => {
    setError('');
    if (!form.phone) return setError('กรุณาระบุหมายเลขโทรศัพท์');
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.code) alert('OTP (dev): ' + data.code);
      } else setError(data.message || `ส่ง OTP ล้มเหลว (status ${res.status})`);
    } catch { setError('เกิดข้อผิดพลาดในการส่ง OTP'); }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!form.phone || !otpCode) return setError('กรุณากรอกหมายเลขและรหัส OTP');
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, code: otpCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifiedPhone(form.phone);
        alert('ยืนยันหมายเลขเรียบร้อย');
      } else setError(data.message || `การยืนยันล้มเหลว (status ${res.status})`);
    } catch { setError('เกิดข้อผิดพลาดในการยืนยัน OTP'); }
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

          {/* vehicle-interest removed as requested */}
        </div>

        <div className="auth-right">
          <h2 style={{ color: '#07203a', marginBottom: 12, textAlign: 'center' }}>แบบฟอร์มสมัครสมาชิก</h2>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>สมัครด้วย {usePhone ? 'เบอร์โทรศัพท์' : 'อีเมล'}</strong>
              <button type="button" onClick={() => setUsePhone(p => !p)} style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>
                {usePhone ? 'ใช้แบบอีเมล' : 'ใช้แบบเบอร์โทร'}
              </button>
            </div>

            <input name="username" className="nice-input" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required />
            {!usePhone && <input name="email" className="nice-input" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required />}
            <input name="name" className="nice-input" placeholder="ชื่อ-สกุล (ไม่บังคับ)" value={form.name} onChange={handleChange} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="phone" className="nice-input" placeholder="โทรศัพท์" value={form.phone} onChange={handleChange} required={usePhone} />
              {usePhone && (
                !otpSent ? 
                  <button type="button" onClick={handleSendOtp} className="btn-primary">ส่ง OTP</button> :
                  <>
                    <input placeholder="รหัส OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                    <button type="button" onClick={handleVerifyOtp} className="btn-primary">ยืนยัน OTP</button>
                  </>
              )}
            </div>
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
            <button className="social-btn" style={{ marginBottom: 10 }} onClick={() => alert('สมัครด้วยเบอร์โทรศัพท์ (OTP)')}>📞 เบอร์โทรศัพท์</button>
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
