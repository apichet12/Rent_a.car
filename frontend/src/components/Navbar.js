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
  const doSearch = () => navigate(!query ? '/cars' : `/cars?q=${encodeURIComponent(query)}`);

  // ------------------------------
  // ซ่อนเมนูล่างหน้าโปรไฟล์ / แก้ไขโปรไฟล์
  // ------------------------------
  const isProfilePage = location.pathname === '/customer/profile';
  const isEditProfilePage = location.pathname === '/customer/edit-profile';

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
    <nav className={`navbar ${showFullNav ? 'expanded' : 'collapsed'}`}>
      {/* แถวบน */}
      <div className="navbar-row navbar-top">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40 }} />
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

        {/* โปรไฟล์ผู้ใช้ / ปุ่มเข้าสู่ระบบ */}
        <div className="navbar-contact" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? <CustomerProfile /> : <Link to="/login" className="navbar-link">เข้าสู่ระบบ 🔐</Link>}
        </div>
      </div>

      {/* แถวล่าง */}
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
  );
};

export default NavbarLogin;
