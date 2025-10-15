// components/NavbarLogin.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';

const PLACEHOLDERS = [
  "ออกแบบโลโก้ร้านอาหารไหนดี...",
  "เปรียบเทียบราคาเช่ารถยนต์ SUV 7 ที่นั่ง...",
  "หาวิธีเรียนพิเศษคณิตศาสตร์สำหรับ ม.ปลาย...",
  "ค้นหาบริการเช่ามอเตอร์ไซค์...",
  "ติวสอบเข้ามหาลัย...",
];
const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 1500;

const NavbarLogin = () => {
  const { user, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [showFullNav, setShowFullNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const fullText = PLACEHOLDERS[placeholderIndex % PLACEHOLDERS.length];
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

  // Show full navbar after scroll
  useEffect(() => {
    if (location.pathname !== '/') {
      setShowFullNav(true);
      return;
    }
    const hero = document.querySelector('.hero-search-pill');
    const threshold = hero ? window.scrollY + hero.getBoundingClientRect().top + hero.getBoundingClientRect().height : 220;
    const onScroll = () => setShowFullNav(window.scrollY > threshold - 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const doSearch = () => navigate(!query ? '/cars' : `/cars?q=${encodeURIComponent(query)}`);

  return (
    <nav className={`navbar ${showFullNav ? 'expanded' : 'collapsed'}`}>
      <div className="navbar-row navbar-top">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <span>Klick Drive</span>
          </Link>
        </div>

        <div className="navbar-search search-pill">
          <div className="pill-content">
            <div className="search-icon">✨</div>
            <input
              className="pill-input navbar-search-input"
              placeholder={displayedPlaceholder || PLACEHOLDERS[0]}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            <button className="pill-go" onClick={doSearch}>AI Search 🔍</button>
          </div>
        </div>

        <div className="navbar-contact" style={{ marginLeft: 'auto' }}>
          {user ? (
            <>
              <span>{user.username}</span>
              <button className="navbar-link" onClick={logout}>ออกจากระบบ</button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">เข้าสู่ระบบ 🔑</Link>
          )}
        </div>
      </div>

      <div className="navbar-row navbar-bottom">
        <div className="navbar-links">
          <div className="navbar-topmenu">
            {[
              { title: 'เช่ารถ', subs: ['เช่ารายวัน','เช่ารายเดือน','เช่าพร้อมคนขับ','เช่าสำหรับท่องเที่ยว','เช่าสำหรับธุรกิจ','เช่ารถไฟฟ้า'] },
              { title: 'เช่ามอเตอร์ไชค์', subs: ['รายวัน','ท่องเที่ยว','สกู๊ตเตอร์ไฟฟ้า','มอเตอร์ไซค์พรีเมียม'] },
              { title: 'เรียนพิเศษ', subs: ['ติวคณิต','ติวภาษาอังกฤษ','ติววิทย์','ติวสอบเข้า','เรียนออนไลน์'] },
              { title: 'บริการ', subs: ['งานช่าง','รับส่ง','บริการทำความสะอาด','บริการสนามบิน'] },
              { title: 'องค์กร', subs: ['เช่าองค์กร','แพ็กเกจพนักงาน','เช่าสำหรับอีเวนท์'] }
            ].map((m, mi) => (
              <div key={mi} className="menu-item dropdown hover-dropdown">
                <button className="dropdown-toggle">{m.title} ▾</button>
                <div className="dropdown-menu multi-col">
                  {m.subs.map((s, si) => (
                    <Link key={si} className="dropdown-item" to={`/cars?q=${encodeURIComponent(s)}`}>{s}</Link>
                  ))}
                </div>
              </div>
            ))}
            {user && user.role === 'admin' && (
              <div className="menu-item dropdown hover-dropdown admin-menu">
                <button className="dropdown-toggle">เมนูแอดมิน ▾</button>
                <div className="dropdown-menu multi-col">
                  <Link className="dropdown-item" to="/admin/cars">จัดการรถ</Link>
                  <Link className="dropdown-item" to="/admin/bookings">จัดการการจอง</Link>
                  <Link className="dropdown-item" to="/admin/users">จัดการผู้ใช้งาน</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-quicklinks">
          <button className="btn-outline" onClick={() => navigate('/cars?type=car')}>เช่ารถยนต์</button>
          <button className="btn-outline" onClick={() => navigate('/cars?type=bike')}>เช่ามอเตอร์ไซค์</button>
          <button className="btn-outline" onClick={() => navigate('/cars?type=special')}>เรียนพิเศษ / บริการเสริม</button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLogin;
