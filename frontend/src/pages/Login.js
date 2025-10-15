import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';

const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ใช้ Context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [wantsOffers, setWantsOffers] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);

  const isLoginButtonDisabled = loading || !agreeTerms || !agreePrivacy;

  const doLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !agreeTerms || !agreePrivacy) {
      return setError('กรุณากรอกข้อมูลให้ครบและยอมรับเงื่อนไขที่บังคับทั้งหมด');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      // Some errors (like the CRA dev proxy failing to reach the backend)
      // return HTML/text instead of JSON which causes `res.json()` to throw.
      // Detect content-type and handle non-JSON responses gracefully.
      const contentType = res.headers.get('content-type') || '';
      let data = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // fallback: read as text and show a readable message
        const text = await res.text();
        console.error('Login API non-JSON response:', text);
        setError(text || 'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      if (res.ok && data && data.success) {
        // ✅ บันทึก user + role ลง Context และ localStorage
        login(data.user.username, data.user.role);
        navigate('/dashboard');
      } else {
        setError((data && data.message) || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
      }
    } catch (err) {
      console.error("Login API Error:", err);
      setError('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <img src="/logo192.png" alt="โลโก้บริษัท" style={{ width: 120, display: 'block', margin: '0 auto' }} />
          <h3 style={{ color: '#07203a', textAlign: 'center', marginTop: 8 }}>ทำไมต้องเลือกเรา</h3>
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
          <h2 style={{ color: '#07203a', marginBottom: 16 }}>เข้าสู่ระบบ</h2>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <form onSubmit={doLogin} style={{ display: 'grid', gap: 12 }}>
            <input 
              className="nice-input" 
              placeholder="อีเมลหรือชื่อผู้ใช้" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              className="nice-input" 
              type="password" 
              placeholder="รหัสผ่าน" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setAgreeTerms(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${agreeTerms ? 'on' : ''}`}>{agreeTerms ? '✓' : ''}</div>
                ฉันได้อ่านและยอมรับ <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 500 }}>เงื่อนไขข้อกำหนดการใช้บริการ*</a>
              </div>

              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setAgreePrivacy(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${agreePrivacy ? 'on' : ''}`}>{agreePrivacy ? '✓' : ''}</div>
                ฉันได้อ่านและยอมรับ <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 500 }}>นโยบายคุ้มครองความเป็นส่วนตัว*</a>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: 8,
                background: isLoginButtonDisabled ? '#cbd5e1' : 'linear-gradient(90deg,#06b6d4,#4f46e5)',
                cursor: isLoginButtonDisabled ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoginButtonDisabled}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            ยังไม่มีบัญชี? <a href="/register" className="small-link" style={{ color: '#10b981', fontWeight: 600 }}>สมัครสมาชิก</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
