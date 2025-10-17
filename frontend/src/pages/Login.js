// Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';
// i18n removed

const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  // Inline static UI strings (i18n removed)
  const LOGIN_TITLE = 'Sign in';
  const PLEASE_FILL_ALL = 'Please fill all required fields';
  const LOADING_TEXT = 'Loading...';
  const EMAIL_PLACEHOLDER = 'Email or username';
  const PASSWORD_PLACEHOLDER = 'Password';
  const AGREE_TERMS_PREFIX = 'I have read and agree to';
  const TERMS_LINK = 'Terms of Service*';
  const PRIVACY_LINK = 'Privacy Policy*';
  const SIGNUP_PROMPT = "Don't have an account?";
  const SIGNUP_LINK = 'Sign up';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const isLoginButtonDisabled = loading || !agreeTerms || !agreePrivacy;

  const doLogin = async (e) => {
    e.preventDefault();
    setError('');

      if (!email || !password || !agreeTerms || !agreePrivacy) {
        return setError(PLEASE_FILL_ALL);
      }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Login API non-JSON response:', text);
        setError(text || 'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      if (res.ok && data && data.success) {
        // ✅ ใช้ response ตรง ๆ (รองรับ backend ปัจจุบัน)
        login(data.username, data.role);
        navigate('/');
      } else {
        setError((data && data.message) || 'Login failed. Please check your credentials.');
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
          <h2 style={{ color: '#07203a', marginBottom: 16 }}>{LOGIN_TITLE}</h2>
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

          <form onSubmit={doLogin} style={{ display: 'grid', gap: 12 }}>
            <input 
              className="nice-input" 
              placeholder={EMAIL_PLACEHOLDER} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              className="nice-input" 
              type="password" 
              placeholder={PASSWORD_PLACEHOLDER} 
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
                {AGREE_TERMS_PREFIX} <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 500 }}>{TERMS_LINK}</a>
              </div>

              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setAgreePrivacy(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${agreePrivacy ? 'on' : ''}`}>{agreePrivacy ? '✓' : ''}</div>
                {AGREE_TERMS_PREFIX} <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 500 }}>{PRIVACY_LINK}</a>
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
              {loading ? LOADING_TEXT : LOGIN_TITLE}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {SIGNUP_PROMPT} <a href="/register" className="small-link" style={{ color: '#10b981', fontWeight: 600 }}>{SIGNUP_LINK}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
