import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

// ข้อมูลข้อดีของแพลตฟอร์ม พร้อมไอคอน (ไม่เปลี่ยนแปลง)
const advantagesWithIcons = [
  { icon: '💰', text: 'รับประกันเงินจ้าง' },
  { icon: '📄', text: 'มีใบประกอบวิชาชีพ' },
  { icon: '🔄', text: 'ผิดเงื่อนไข ยินดีคืนเงิน' },
  { icon: '🗨️', text: 'ให้คำแนะนำตลอดการจ้าง' },
  { icon: '✅', text: 'ฟรีแลนซ์ผ่านการตรวจสอบ' }
];

const Login = () => {
  const navigate = useNavigate();

  // --- State สำหรับการจัดการฟอร์มและสถานะ ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State สำหรับ Facebook Login
  const [fbName, setFbName] = useState('');
  
  // State สำหรับ Checkbox/Toggle ต่างๆ
  const [wantsOffers, setWantsOffers] = useState(true); 
  const [agreeTerms, setAgreeTerms] = useState(false); // เงื่อนไขข้อกำหนด* (Required)
  const [agreePrivacy, setAgreePrivacy] = useState(false); // นโยบายความเป็นส่วนตัว* (Required)
  const [wantsNewsletter, setWantsNewsletter] = useState(false); 


  // --- useEffect: การโหลด Facebook SDK (ไม่เปลี่ยนแปลง) ---
  useEffect(() => {
    // โค้ดโหลด Facebook SDK... (เหมือนเดิม)
    if (window.FB) return; 

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '807950298481394', // << ใส่ App ID ของคุณที่นี่
        cookie: true, 
        xfbml: true, 
        version: 'v18.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/th_TH/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []); 

  // --- Logic การตรวจสอบความถูกต้องของฟอร์ม (Disabled Button) ---
  // ปุ่มจะถูกปิดการใช้งานถ้า: กำลังโหลด OR เงื่อนไขข้อกำหนดไม่ถูกยอมรับ OR นโยบายความเป็นส่วนตัวไม่ถูกยอมรับ
  const isLoginButtonDisabled = loading || !agreeTerms || !agreePrivacy;

  // --- ฟังก์ชัน: การเข้าสู่ระบบด้วยอีเมล/รหัสผ่านปกติ (ปรับปรุงการตรวจสอบ) ---
  const doLogin = async (e) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบความถูกต้องเบื้องต้น (รวมถึงการยอมรับเงื่อนไข)
    if (!email || !password || !agreeTerms || !agreePrivacy) {
      // ไม่ควรถึงจุดนี้ถ้าปุ่มถูก Disabled อย่างถูกต้อง แต่ใส่ไว้เพื่อความปลอดภัย
      return setError('กรุณากรอกข้อมูลให้ครบและยอมรับเงื่อนไขที่บังคับทั้งหมด');
    }
    
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: email, 
            password,
            wantsOffers: wantsOffers, 
            wantsNewsletter: wantsNewsletter
        }) 
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
      }
    } catch (err) {
      console.error("Login API Error:", err);
      setError('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // --- ฟังก์ชัน: การเข้าสู่ระบบด้วย Facebook (ไม่เปลี่ยนแปลง) ---
  const handleFbLogin = () => {
    if (!window.FB) return alert('Facebook SDK ยังโหลดไม่เสร็จ กรุณารอสักครู่');
    // โค้ด Facebook Login... (เหมือนเดิม)
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          window.FB.api('/me', { fields: 'name,email' }, (user) => {
            setFbName(user.name);
            console.log('Facebook User:', user);
            navigate('/dashboard'); 
          });
        } else {
          setError('การเข้าสู่ระบบด้วย Facebook ถูกยกเลิกหรือล้มเหลว');
        }
      },
      { scope: 'public_profile,email' } 
    );
  };

  // --- Component Render ---
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* === ส่วนซ้าย: ข้อดีของแพลตฟอร์ม (ไม่เปลี่ยนแปลง) === */}
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

        {/* === ส่วนขวา: ฟอร์มเข้าสู่ระบบ === */}
        <div className="auth-right">
          <h2 style={{ color: '#07203a', marginBottom: 16 }}>เข้าสู่ระบบ</h2>
          
          {/* ส่วนแสดงข้อความผิดพลาด */}
          {error && <div style={{ background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12, border: '1px solid #fca5a5' }}>{error}</div>}

          {/* ข้อความต้อนรับสำหรับผู้ที่เคยล็อคอินด้วย Facebook */}
          {fbName && <div style={{ marginBottom: 12, color: '#1a73e8', fontWeight: 700, padding: 10, background: '#e0f7fa', borderRadius: 8 }}>ยินดีต้อนรับ, {fbName}</div>}

          <form onSubmit={doLogin} style={{ display: 'grid', gap: 12 }}>
            {/* ช่องกรอกอีเมล/ชื่อผู้ใช้และรหัสผ่าน (ไม่เปลี่ยนแปลง) */}
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
            
            {/* ส่วนตัวเลือก "รับข้อเสนอพิเศษ" และ "ลืมรหัสผ่าน" */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setWantsOffers(v => !v)}>
              </div>
              <a href="/forgot" style={{ color: '#64748b', textDecoration: 'none' }}>ลืมรหัสผ่าน?</a>
            </div>

            {/* Stacked agreement: ใช้ Toggle Circle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              
              {/* Toggle Circle: เงื่อนไขข้อกำหนด (บังคับ) */}
              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setAgreeTerms(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${agreeTerms ? 'on' : ''}`} onKeyDown={(e) => {if (e.key === 'Enter') setAgreeTerms(v => !v)}}>{agreeTerms ? '✓' : ''}</div>
                ฉันได้อ่านและยอมรับ <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#10b981', fontWeight: 500 }}>เงื่อนไขข้อกำหนดการใช้บริการ*</a>
              </div>
              
              {/* Toggle Circle: นโยบายคุ้มครองความเป็นส่วนตัว (บังคับ) */}
              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setAgreePrivacy(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${agreePrivacy ? 'on' : ''}`} onKeyDown={(e) => {if (e.key === 'Enter') setAgreePrivacy(v => !v)}}>{agreePrivacy ? '✓' : ''}</div>
                ฉันได้อ่านและยอมรับ <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#10b981', fontWeight: 500 }}>นโยบายคุ้มครองความเป็นส่วนตัว*</a>
              </div>
              
              {/* Toggle Circle: ข้อมูลข่าวสาร (ไม่บังคับ) */}
              <div 
                className="auth-checkbox" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} 
                onClick={() => setWantsNewsletter(v => !v)}
              >
                <div role="button" tabIndex={0} className={`toggle-circle ${wantsNewsletter ? 'on' : ''}`} onKeyDown={(e) => {if (e.key === 'Enter') setWantsNewsletter(v => !v)}}>{wantsNewsletter ? '✓' : ''}</div>
                ฉันสนใจรับข้อมูลข่าวสาร ส่วนลดและโปรโมชั่นผ่านทางอีเมล
              </div>

            </div>

            {/* ปุ่มเข้าสู่ระบบ: ใช้ Logic isLoginButtonDisabled และปรับ Style ให้ไม่มีสีเมื่อ Disabled */}
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: 8,
                // ปรับ Style เมื่อถูกปิดการใช้งาน
                background: isLoginButtonDisabled ? '#cbd5e1' : 'linear-gradient(90deg,#06b6d4,#4f46e5)',
                cursor: isLoginButtonDisabled ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoginButtonDisabled} // ปิดการใช้งานปุ่ม
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* ส่วน Social Login (ไม่เปลี่ยนแปลง) */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', lineHeight: '0.1em', margin: '16px 0 16px' }}>
                <span style={{ background: '#fff', padding: '0 10px', color: '#6b7280' }}>หรือ</span>
            </div>
            <button 
              className="social-btn facebook-btn" 
              onClick={handleFbLogin}
              style={{ background: '#1877f2', color: 'white', borderColor: '#1877f2' }}
              disabled={loading}
            >
              🔵 เข้าสู่ระบบด้วย Facebook
            </button>
          </div>

          {/* ลิงก์สมัครสมาชิก (ไม่เปลี่ยนแปลง) */}
          <div className="auth-aux" style={{ marginTop: 20, textAlign: 'center' }}>
            ยังไม่มีบัญชี? <a href="/register" className="small-link" style={{ color: '#10b981', fontWeight: 600 }}>สมัครสมาชิก</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;