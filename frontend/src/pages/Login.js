import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

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
    <div className="login-page">
      <header className="login-hero">
        <img src="/logo192.png" alt="logo" className="login-logo" />
        <h1 className="login-title">Rent a car with Catty Pa Plearn</h1>
        <p className="login-sub">เพื่อนแท้ทุกการเดินทาง</p>
      </header>

      <div className="mascot-wrap">
        <img src="/mascot.png" alt="mascot" className="mascot-img" />
      </div>

      <div className="login-card">
        {error && <div className="alert-error">{error}</div>}

        <div className="primary-cta">
          <button className="btn-primary btn-large" onClick={() => setMode('login')}>เข้าสู่ระบบ</button>
          <div className="muted">ยังไม่เคยเป็นสมาชิก? <button className="link-btn" onClick={() => setMode('register')}>สมัครฟรี!</button></div>
        </div>

        {mode === 'login' ? (
          <form onSubmit={doLogin} className="form-grid">
            <input className="nice-input" placeholder="อีเมล หรือ ชื่อผู้ใช้" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            <input className="nice-input" type="password" placeholder="รหัสผ่าน" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'ถัดไป'}</button>
          </form>
        ) : (
          <form onSubmit={doRegister} className="form-grid">
            <input className="nice-input" name="username" placeholder="ชื่อผู้ใช้" value={reg.username} onChange={e => setReg({ ...reg, username: e.target.value })} required />
            <input className="nice-input" name="email" placeholder="อีเมล (ถ้ามี)" value={reg.email} onChange={e => setReg({ ...reg, email: e.target.value })} />
            <div className="phone-row">
              <input className="nice-input" name="phone" placeholder="เบอร์โทรศัพท์" value={reg.phone} onChange={e => setReg({ ...reg, phone: e.target.value })} />
              {!otpSent ? (
                <button type="button" className="btn-outline" onClick={sendOtp}>ส่ง OTP</button>
              ) : (
                <>
                  <input className="nice-input" placeholder="รหัส OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} />
                  <button type="button" className="btn-outline" onClick={verifyOtp}>ยืนยัน</button>
                </>
              )}
            </div>
            <input className="nice-input" name="password" type="password" placeholder="รหัสผ่าน" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} required />
            <input className="nice-input" name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" value={reg.confirmPassword} onChange={e => setReg({ ...reg, confirmPassword: e.target.value })} required />
            <button className="btn-primary" type="submit">สมัครสมาชิกใหม่ฟรี!</button>
          </form>
        )}

        <div className="divider"><span>หรือ</span></div>

        <div className="socials">
          <button className="social-btn phone" onClick={() => alert('เข้าสู่ระบบด้วยเบอร์ (OTP)')}>เบอร์โทรศัพท์</button>
          <button className="social-btn fb" onClick={async () => { try { const r = await fetch('/auth/facebook'); const j = await r.json(); alert(j.message || 'Facebook'); } catch(e){ alert('Facebook login error') } }}>เข้าสู่ระบบ Facebook</button>
          <button className="social-btn google" onClick={async () => { try { const r = await fetch('/auth/google'); const j = await r.json(); alert(j.message || 'Google'); } catch(e){ alert('Google login error') } }}>เข้าสู่ระบบ Google</button>
        </div>

        <div className="terms">การลงชื่อสมัครใช้บริการของคุณยอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว</div>
      </div>
    </div>
  );
}
