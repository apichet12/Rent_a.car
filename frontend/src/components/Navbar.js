// src/components/NavbarLogin.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';
import CustomerProfile from '../pages/customer/CustomerProfile';

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 1500;

const NavbarLogin = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [showFullNav, setShowFullNav] = useState(false);
  
  // สถานะใหม่สำหรับควบคุมเมนูมือถือ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const navigate = useNavigate();
  const location = useLocation();

  // ------------------------------
  // Typewriter placeholder effect
  // ------------------------------
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const placeholders = [
      'ออกแบบโลโก้ร้านอาหาร...',
      'เปรียบเทียบราคาเช่ารถยนต์ SUV 7 ที่นั่ง...',
      'หาวิธีเรียนพิเศษคณิตศาสตร์ ม.ปลาย...',
      'ค้นหาบริการเช่ามอเตอร์ไซค์...'
    ];
    const fullText = placeholders[placeholderIndex % placeholders.length];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => setDisplayedPlaceholder(prev => prev.slice(0, -1)), DELETING_SPEED);
      if (displayedPlaceholder === '') {
        setIsDeleting(false);
        setPlaceholderIndex(prev => prev + 1);
      }
    } else {
      timer = setTimeout(() => setDisplayedPlaceholder(fullText.slice(0, displayedPlaceholder.length + 1)), TYPING_SPEED);
      if (displayedPlaceholder === fullText) {
        clearTimeout(timer);
        timer = setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
      }
    }
    return () => clearTimeout(timer);
  }, [displayedPlaceholder, isDeleting, placeholderIndex]);

  // ------------------------------
  // แสดง navbar เต็มเมื่อ scroll หรืออยู่หน้าอื่น
  // ------------------------------
  useEffect(() => {
    if (location.pathname !== '/') {
      setShowFullNav(true);
      return;
    }
    const hero = document.querySelector('.hero-search-pill');
    const threshold = hero
      ? window.scrollY + hero.getBoundingClientRect().top + hero.getBoundingClientRect().height
      : 220;
    const onScroll = () => setShowFullNav(window.scrollY > threshold - 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // ------------------------------
  // ฟังก์ชันค้นหา
  // ------------------------------
  const doSearch = () => {
    navigate(!query ? '/cars' : `/cars?q=${encodeURIComponent(query)}`);
    // ปิดเมนูมือถือหลังจากค้นหา
    setIsMobileMenuOpen(false); 
  };
  
  // ------------------------------
  // Handlers for Mobile Menu
  // ------------------------------
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
      <nav className={`navbar ${showFullNav ? 'expanded' : 'collapsed'}`}>
        {/* แถวบน */}
        <div className="navbar-row navbar-top">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              {/* ใช้ SVG สำหรับโลโก้เพื่อให้ดูคมชัดและยืดหยุ่น */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#007bff" opacity="0.15"/>
                <path d="M12 4a8 8 0 100 16 8 8 0 000-16zM11 8v4h4" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 16.5c-1.5-1.5-3.5-2-6-2s-4.5.5-6 2" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Klick Drive</span>
            </Link>
          </div>

          {/* ช่องค้นหา */}
          <div className="navbar-search search-pill" style={{ flex: 1, margin: '0 20px' }}>
            <div className="pill-content">
              <div className="search-icon">✨</div>
              <input
                className="pill-input navbar-search-input"
                placeholder={displayedPlaceholder || 'ออกแบบโลโก้ร้านอาหาร...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
              />
              <button className="pill-go" onClick={doSearch}>ค้นหา 🔍</button>
            </div>
          </div>

          {/* โปรไฟล์ผู้ใช้ / ปุ่มเข้าสู่ระบบ / ปุ่มเมนูมือถือ */}
          <div className="navbar-contact" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* แสดงปุ่ม Login/Profile บนเดสก์ท็อปเท่านั้น (แสดงเมื่อหน้าจอกว้างกว่า 1024px) */}
            <div 
              style={{ display: window.innerWidth > 1024 ? 'flex' : 'none' }}
              className="desktop-auth-buttons" 
            >
              {user ? <CustomerProfile /> : <Link to="/login" className="navbar-link">เข้าสู่ระบบ 🔐</Link>}
            </div>

            {/* ปุ่มแฮมเบอร์เกอร์ (แสดงเฉพาะบนมือถือ/แท็บเล็ต) */}
            <button
              className="navbar-hamburger"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              // แสดงเฉพาะบนหน้าจอเล็ก (ตาม CSS media query ที่คาดไว้)
              style={{ display: window.innerWidth <= 1024 ? 'inline-flex' : 'none' }} 
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>

        {/* แถวล่าง (ซ่อนด้วย CSS บนมือถือ) */}
        <div className={`navbar-row navbar-bottom ${user?.role === 'admin' ? 'admin-row' : ''}`}>
          <div className="navbar-links">
            <div className="navbar-topmenu">
              {MENU_ITEMS.map((m, mi) => (
                <div key={mi} className="menu-item dropdown hover-dropdown">
                  <button className="dropdown-toggle">{m.title} ▾</button>
                  <div className="dropdown-menu multi-col">
                    {m.subs.map((s, si) => (
                      <Link key={si} className="dropdown-item" to={`/cars?q=${encodeURIComponent(s)}`}>
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {user && user.role === 'admin' && (
                <div className="menu-item dropdown hover-dropdown admin-menu">
                  <button className="dropdown-toggle">เมนูแอดมิน ▾</button>
                  <div className="dropdown-menu multi-col">
                    <Link className="dropdown-item" to="/admin/cars">🚗 จัดการรถ</Link>
                    <Link className="dropdown-item" to="/admin/bookings">📅 จัดการการจอง</Link>
                    <Link className="dropdown-item" to="/admin/users">👤 จัดการผู้ใช้</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ปุ่มลัด */}
          <div className="navbar-quicklinks">
            <button className="btn-outline" onClick={() => navigate('/cars?type=car')}>เช่ารถ</button>
            <button className="btn-outline" onClick={() => navigate('/cars?type=bike')}>เช่ามอเตอร์ไซค์</button>
            <button className="btn-outline" onClick={() => navigate('/cars?type=special')}>ติว / บริการ</button>
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
              <span>Klick Drive</span>
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
