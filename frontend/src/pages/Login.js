import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [reg, setReg] = useState({ username: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');

  const doLogin = async (e) => {
    e && e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) return setError('กรุณากรอกข้อมูลให้ครบ');
    setLoading(true);
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: loginEmail, password: loginPassword }) });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user.username, data.user.role);
        navigate('/dashboard');
      } else setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } catch (e) { setError('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'); }
    setLoading(false);
  };

  const sendOtp = async () => {
    setError('');
    if (!reg.phone) return setError('กรุณากรอกหมายเลขโทรศัพท์');
    try {
      const res = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: reg.phone }) });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.code) window.alert('OTP (dev): ' + data.code);
      } else setError(data.message || 'ส่ง OTP ไม่ได้');
    } catch (e) { setError('ส่ง OTP ผิดพลาด'); }
  };

  const verifyOtp = async () => {
    setError('');
    if (!reg.phone || !otpCode) return setError('กรุณาระบุหมายเลขและรหัส OTP');
    try {
      const res = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: reg.phone, code: otpCode }) });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifiedPhone(data.phone || reg.phone);
        window.alert('ยืนยันหมายเลขเรียบร้อย');
      } else setError(data.message || 'ยืนยัน OTP ไม่สำเร็จ');
    } catch (e) { setError('ยืนยัน OTP ผิดพลาด'); }
  };

  const doRegister = async (e) => {
    e && e.preventDefault();
    setError('');
    if (reg.password !== reg.confirmPassword) return setError('รหัสผ่านไม่ตรงกัน');
    if (reg.phone && !verifiedPhone) return setError('กรุณายืนยันหมายเลขโทรศัพท์ก่อนสมัคร');
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reg) });
      const data = await res.json();
      if (res.ok && data.success) {
        window.alert('สมัครสมาชิกสำเร็จ');
        setMode('login');
      } else setError(data.message || 'สมัครสมาชิกไม่สำเร็จ');
    } catch (e) { setError('สมัครสมาชิกผิดพลาด'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fb', padding: 24 }}>
      <div style={{ width: 520, borderRadius: 12, boxShadow: '0 10px 40px rgba(2,6,23,0.08)', overflow: 'hidden', background: '#fff' }}>
        <div style={{ padding: 18, borderBottom: '1px solid #eef2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo192.png" alt="logo" style={{ width: 44 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>ยินดีต้อนรับกลับมา!</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>เข้าสู่ระบบสมาชิกติดตามสถานะกับเราได้ง่ายกว่า</div>
            </div>
          </div>
          <div>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'transparent', border: '1px solid #e6eef6', padding: '8px 12px', borderRadius: 8, color: '#0ea5b1' }}>
              {mode === 'login' ? 'สมัครสมาชิกเลย' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </div>

        <div style={{ padding: 22 }}>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          {mode === 'login' ? (
            <form onSubmit={doLogin} style={{ display: 'grid', gap: 12 }}>
              <input className="nice-input" placeholder="อีเมล หรือ ชื่อผู้ใช้" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              <input className="nice-input" type="password" placeholder="รหัสผ่าน" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              <button className="btn-primary" type="submit" disabled={loading} style={{ fontWeight: 800 }}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
            </form>
          ) : (
            <form onSubmit={doRegister} style={{ display: 'grid', gap: 10 }}>
              <input className="nice-input" name="username" placeholder="ชื่อผู้ใช้" value={reg.username} onChange={e => setReg({ ...reg, username: e.target.value })} required />
              <input className="nice-input" name="email" placeholder="อีเมล (ถ้ามี)" value={reg.email} onChange={e => setReg({ ...reg, email: e.target.value })} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="nice-input" name="phone" placeholder="เบอร์โทรศัพท์" value={reg.phone} onChange={e => setReg({ ...reg, phone: e.target.value })} />
                <div style={{ display: 'flex', gap: 8 }}>
                  {!otpSent ? (
                    <button type="button" className="btn-outline" onClick={sendOtp}>ส่ง OTP</button>
                  ) : (
                    <>
                      <input className="nice-input" placeholder="รหัส OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                      <button type="button" className="btn-outline" onClick={verifyOtp}>ยืนยัน</button>
                    </>
                  )}
                </div>
              </div>
              <input className="nice-input" name="password" type="password" placeholder="รหัสผ่าน" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} required />
              <input className="nice-input" name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" value={reg.confirmPassword} onChange={e => setReg({ ...reg, confirmPassword: e.target.value })} required />
              <button className="btn-primary" type="submit" style={{ fontWeight: 800 }}>สมัครสมาชิก</button>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#eef2f7' }}></div>
            <div style={{ color: '#94a3b8' }}>หรือ</div>
            <div style={{ flex: 1, height: 1, background: '#eef2f7' }}></div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <button className="btn-ghost" style={{ padding: 12 }} onClick={() => alert('เข้าสู่ระบบด้วยเบอร์: ฟีเจอร์ OTP ที่หน้า สมัคร')}>📞 เบอร์โทรศัพท์</button>
            <button className="btn-ghost" style={{ padding: 12 }} onClick={async () => { try { const r = await fetch('/auth/facebook'); const j = await r.json(); alert(j.message || 'Facebook'); } catch(e){ alert('Facebook login error') } }}>🔵 เข้าสู่ระบบด้วย Facebook</button>
            <button className="btn-ghost" style={{ padding: 12 }} onClick={async () => { try { const r = await fetch('/auth/google'); const j = await r.json(); alert(j.message || 'Google'); } catch(e){ alert('Google login error') } }}>🔴 เข้าสู่ระบบด้วย Google</button>
          </div>

        </div>
      </div>
    </div>
  );
}
