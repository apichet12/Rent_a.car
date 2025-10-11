import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

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
    if (usePhone && !verifiedPhone) {
      setError('กรุณายืนยันหมายเลขโทรศัพท์ด้วย OTP ก่อนสมัคร');
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { setError('Response ไม่ใช่ JSON'); return; }

      if (data.success) {
        alert(data.message || 'สมัครสมาชิกสำเร็จ');
        navigate('/login');
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
      }
    } catch (err) { setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'); }
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
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, maxWidth: 960, width: '100%', flexWrap: 'wrap' }}>
        
        {/* LEFT: LOGO + ADVANTAGES */}
        <div style={{
  flex: '1 1 320px',
  minWidth: 280,
  background: '#f0f4ff',
  borderRadius: 12,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  boxShadow: '0 8px 30px rgba(2,6,23,0.04)'
}}>
  <img src="/logo192.png" alt="logo" style={{ width: 140, marginBottom: 12 }} />
  <h3 style={{ color: '#07203a', textAlign: 'center' }}>ข้อดีของบริการเรา</h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
    {advantagesWithIcons.map((adv, i) => (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#fff',
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}>
        <span style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18
        }}>{adv.icon}</span>
        <span style={{ color: '#07203a', fontWeight: 500 }}>{adv.text}</span>
      </div>
    ))}
  </div>
</div>
        {/* RIGHT: REGISTER FORM */}
        <div style={{
          flex: '1 1 360px',
          minWidth: 300,
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          boxShadow: '0 8px 30px rgba(2,6,23,0.04)'
        }}>
          <h2 style={{ color: '#07203a', marginBottom: 12, textAlign: 'center' }}>แบบฟอร์มสมัครสมาชิก</h2>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>สมัครด้วย {usePhone ? 'เบอร์โทรศัพท์' : 'อีเมล'}</strong>
              <button type="button" onClick={() => setUsePhone(p => !p)} style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>
                {usePhone ? 'ใช้แบบอีเมล' : 'ใช้แบบเบอร์โทร'}
              </button>
            </div>

            <input className="nice-input" name="username" placeholder="ชื่อผู้ใช้ / Username" value={form.username} onChange={handleChange} required />
            {!usePhone && <input className="nice-input" name="email" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required />}
            <input className="nice-input" name="name" placeholder="ชื่อ-สกุล (ไม่บังคับ)" value={form.name} onChange={handleChange} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="nice-input" name="phone" placeholder="โทรศัพท์" value={form.phone} onChange={handleChange} required={usePhone} />
              {usePhone && (
                !otpSent ?
                  <button type="button" className="btn-outline" onClick={handleSendOtp}>ส่ง OTP</button>
                  :
                  <>
                    <input className="nice-input" placeholder="รหัส OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                    <button type="button" className="btn-outline" onClick={handleVerifyOtp}>ยืนยัน OTP</button>
                  </>
              )}
            </div>
            <input className="nice-input" name="password" type="password" placeholder="รหัสผ่าน" value={form.password} onChange={handleChange} required />
            <input className="nice-input" name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" value={form.confirmPassword} onChange={handleChange} required />
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, borderRadius: 8, fontWeight: 700 }}>สมัครสมาชิก</button>
          </form>

          <div style={{ marginTop: 16, width: '100%' }}>
            <p style={{ color: '#6b7280', marginBottom: 12, textAlign: 'center' }}>หรือสมัครด้วย</p>
            <button style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={() => alert('สมัครด้วยเบอร์โทรศัพท์ (OTP)')}>📞 เบอร์โทรศัพท์</button>
            <button style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }} onClick={async () => { alert('สมัครด้วย Facebook') }}>🔵 Facebook</button>
            <button style={{ width: '100%', padding: 12, borderRadius: 8 }} onClick={async () => { alert('สมัครด้วย Google') }}>🟢 Google</button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            มีบัญชีแล้ว? <a href="/login" style={{ color: '#06b6d4', fontWeight: 700 }}>เข้าสู่ระบบ</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
