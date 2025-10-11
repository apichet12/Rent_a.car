import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fbName, setFbName] = useState('');

  // โหลด Facebook SDK
  useEffect(() => {
    // ตรวจสอบว่ามี FB SDK โหลดแล้วหรือยัง
    if (window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '807950298481394', // ใส่ App ID ของคุณ
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/th_TH/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('กรุณากรอกข้อมูลให้ครบ');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) navigate('/dashboard');
      else setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } catch {
      setError('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    }
    setLoading(false);
  };

  const handleFbLogin = () => {
    if (!window.FB) return alert('Facebook SDK ยังโหลดไม่เสร็จ');
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          window.FB.api('/me', { fields: 'name,email' }, (user) => {
            setFbName(user.name);
            // คุณสามารถส่ง user.id หรือ user.email ไป backend ต่อได้
            console.log('Facebook User:', user);
            navigate('/dashboard'); // ตัวอย่างนำไปหน้า dashboard
          });
        } else {
          alert('Login with Facebook failed');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 980, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {/* LEFT: LOGO + ADVANTAGES */}
        <div
          style={{
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
          }}
        >
          <img src="/logo192.png" alt="logo" style={{ width: 140, marginBottom: 12 }} />
          <h3 style={{ color: '#07203a', textAlign: 'center' }}>ข้อดีของบริการเรา</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            {advantagesWithIcons.map((adv, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}
                >
                  {adv.icon}
                </span>
                <span style={{ color: '#07203a', fontWeight: 500 }}>{adv.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: LOGIN FORM */}
        <div
          style={{
            flex: '1 1 360px',
            minWidth: 300,
            padding: 28,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 30px rgba(2,6,23,0.04)'
          }}
        >
          <h2 style={{ color: '#07203a', marginBottom: 12 }}>เข้าสู่ระบบ</h2>
          {error && (
            <div
              style={{
                background: '#fff1f2',
                color: '#991b1b',
                padding: 10,
                borderRadius: 8,
                marginBottom: 12
              }}
            >
              {error}
            </div>
          )}

          {fbName && (
            <div style={{ marginBottom: 12, color: '#1a73e8', fontWeight: 700 }}>
              ยินดีต้อนรับ, {fbName}
            </div>
          )}

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
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 8, fontWeight: 700 }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div style={{ marginTop: 16 }}>
            <button
              style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 10 }}
              onClick={handleFbLogin}
            >
              🔵 Facebook
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            ยังไม่มีบัญชี?{' '}
            <a href="/register" style={{ color: '#06b6d4', fontWeight: 700 }}>
              สมัครสมาชิก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
