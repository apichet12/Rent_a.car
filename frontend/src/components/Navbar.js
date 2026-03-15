// src/components/NavbarLogin.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';
import CustomerProfile from '../pages/customer/CustomerProfile';

const NavbarLogin = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('สนามบิน, เมือง หรือสถานี');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ------------------------------
  // Handlers for Mobile Menu
  // ------------------------------
  const doSearch = () => {
    navigate(!query ? '/cars' : `/cars?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
  };

  // typewriter placeholder
  useEffect(() => {
    const phrases = [
      'สนามบิน สุวรรณภูมิ → เชียงใหม่... คุณพร้อมหรือยัง?',
      'ค้นหาเช่ารถ 7 ที่นั่ง สำหรับครอบครัว...',
      'จองรถรับ-ส่งสนามบินในสักครู่...',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let forward = true;
    let timeout;

    const tick = () => {
      const current = phrases[phraseIndex];
      if (forward) {
        charIndex++;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === current.length) {
          forward = false;
          timeout = setTimeout(tick, 900);
          return;
        }
      } else {
        charIndex--;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === 0) {
          forward = true;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      timeout = setTimeout(tick, forward ? 80 : 40);
    };

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);


  // ------------------------------
  // เมนูหลักของ navbar
  // ------------------------------
  const MENU_ITEMS = [
    { title: 'เช่ารถ', subs: ['เช่ารายวัน', 'เช่ารายเดือน', 'เช่าพร้อมคนขับ', 'ท่องเที่ยว', 'ธุรกิจ', 'รถไฟฟ้า'] },
    { title: 'เช่ามอเตอร์ไซค์', subs: ['รายวัน', 'ท่องเที่ยว', 'สกู๊ตเตอร์ไฟฟ้า', 'พรีเมียม'] },
    { title: 'ติวเรียน', subs: ['คณิตศาสตร์', 'ภาษาอังกฤษ', 'วิทยาศาสตร์', 'ติวสอบเข้า', 'เรียนออนไลน์'] },
    { title: 'บริการ', subs: ['ช่างซ่อม', 'จัดส่ง', 'ทำความสะอาด', 'รับส่งสนามบิน'] },
    { title: 'องค์กร', subs: ['เช่าองค์กร', 'แพ็กเกจพนักงาน', 'เช่าสำหรับอีเวนท์'] },
  ];

  // ------------------------------
  // Render Navbar
  // ------------------------------
  return (
    <>
      <nav className="navbar">
        {/* แถวบน */}
        <div className="navbar-row navbar-top">
          <div className="navbar-left">
            {/* ปุ่มแฮมเบอร์เกอร์ (แสดงเฉพาะบนมือถือ/แท็บเล็ต) */}
            <button
              className="navbar-hamburger"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              style={{ display: window.innerWidth <= 1024 ? 'inline-flex' : 'none', marginRight: 12 }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            <Link to="/" className="navbar-brand">
              {/* ใช้ SVG สำหรับโลโก้เพื่อให้ดูคมชัดและยืดหยุ่น */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#007bff" opacity="0.15"/>
                <path d="M12 4a8 8 0 100 16 8 8 0 000-16zM11 8v4h4" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 16.5c-1.5-1.5-3.5-2-6-2s-4.5.5-6 2" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>เช่ารถกับแคทตี้</span>
            </Link>

            {/* ช่องค้นหา (Desktop) */}
            <div className="navbar-search" style={{ display: window.innerWidth > 1024 ? 'flex' : 'none' }}>
              <div className="navbar-search-icon">🔍</div>
              <input
                className="navbar-search-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder={placeholder}
              />
              <button className="navbar-search-button" onClick={doSearch}>ค้นหา</button>
            </div>
          </div>

          {/* เมนูลัดด้านขวา (Desktop) */}
          <div className="navbar-contact" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="navbar-action-group" style={{ display: window.innerWidth > 1024 ? 'flex' : 'none', gap: 12, alignItems: 'center' }}>
              <button className="navbar-action" type="button" onClick={() => navigate('/help')}>
                ❓ <span className="navbar-action-label">ช่วย</span>
              </button>
              <button className="navbar-action" type="button" onClick={() => navigate('/booking')}>
                🚗 <span className="navbar-action-label">จัดการการจอง</span>
              </button>
              <button className="navbar-action" type="button">
                🌐 <span className="navbar-action-label">EN | $</span>
              </button>
              <div className="navbar-divider" />
              {user ? (
                <CustomerProfile />
              ) : (
                <>
                  <Link to="/login" className="navbar-link">
                    👤 เข้าสู่ระบบ
                  </Link>
                  <span className="navbar-separator">|</span>
                  <Link to="/register" className="navbar-link">
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

      </nav>

      
      <div 
          className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={closeMobileMenu} // Close when clicking backdrop
      >
        <div 
            className="mobile-menu-inner" 
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the drawer
        >
          {/* Top Header of Drawer */}
          <div className="mobile-menu-top">
            <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
              <img src="/logo192.png" alt="Logo" style={{ width: 32, height: 32 }} />
              <span>เช่ารถกับแคทตี้</span>
            </Link>
            <button 
              className="navbar-hamburger" 
              onClick={closeMobileMenu} 
              style={{ marginLeft: 'auto', fontSize: '1.5rem', fontWeight: 600 }}
            >
              ✕
            </button>
          </div>

          {/* User Auth/Profile in Drawer */}
          <div className="mobile-menu-top" style={{ borderBottom: 'none', padding: '12px 20px', backgroundColor: '#f9f9f9' }}>
            {user ? (
              // แสดงโปรไฟล์ผู้ใช้แบบง่ายในเมนู
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                  {user.displayName ? user.displayName[0] : 'U'}
                </div>
                <span>ยินดีต้อนรับ, {user.displayName || 'ผู้ใช้'}</span>
                <Link to="/profile" className="navbar-link text-sm" onClick={closeMobileMenu}>
                  ดูโปรไฟล์
                </Link>
              </div>
            ) : (
              // ปุ่มเข้าสู่ระบบ
              <Link to="/login" className="btn-outline" onClick={closeMobileMenu} style={{ borderColor: '#007bff', color: '#007bff', padding: '8px 16px', borderRadius: '8px' }}>
                เข้าสู่ระบบ 🔐
              </Link>
            )}
          </div>
          
          {/* Main Links */}
          <div className="mobile-menu-links">
            {MENU_ITEMS.map((m, mi) => (
              <div key={mi} className="mobile-menu-section">
                <div className="mobile-menu-section-title">{m.title}</div>
                <div className="mobile-menu-section-items">
                  {m.subs.map((s, si) => (
                    <Link 
                      key={si} 
                      className="mobile-menu-link" 
                      to={`/cars?q=${encodeURIComponent(s)}`}
                      onClick={closeMobileMenu}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {user && user.role === 'admin' && (
              <div className="mobile-menu-section admin-menu">
                <div className="mobile-menu-section-title">เมนูแอดมิน</div>
                <div className="mobile-menu-section-items">
                  <Link className="mobile-menu-link" to="/admin/cars" onClick={closeMobileMenu}>🚗 จัดการรถ</Link>
                  <Link className="mobile-menu-link" to="/admin/bookings" onClick={closeMobileMenu}>📅 จัดการการจอง</Link>
                  <Link className="mobile-menu-link" to="/admin/users" onClick={closeMobileMenu}>👤 จัดการผู้ใช้</Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mobile-quicklinks">
            <button className="btn-outline" onClick={() => { navigate('/cars?type=car'); closeMobileMenu(); }}>เช่ารถ</button>
            <button className="btn-outline" onClick={() => { navigate('/cars?type=bike'); closeMobileMenu(); }}>เช่ามอเตอร์ไซค์</button>
            <button className="btn-outline" onClick={() => { navigate('/cars?type=special'); closeMobileMenu(); }}>ติว / บริการ</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default NavbarLogin;
