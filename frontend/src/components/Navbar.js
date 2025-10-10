import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/cars', label: 'เลือกรถ' },
  { to: '/gallery', label: 'แกลเลอรี่' },
  { to: '/booking', label: 'จองรถ' },
  { to: '/review', label: 'รีวิว' },
  { to: '/contact', label: 'ติดต่อ' },
];

const Navbar = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo192.png" alt="Drivehub" style={{ width: 36, height: 36 }} />
        <span className="navbar-brand">DRIVEHUB</span>
      </div>

      <div className={`navbar-links ${showMenu ? 'show' : ''}`}>
        <div className="navbar-topmenu">
          <div className="menu-item">เช่ารถกับ Drivehub ▾</div>
          <div className="menu-item">ความช่วยเหลือ</div>
          <div className="menu-item">สมัครสมาชิก/ลงชื่อเข้าใช้ ▾</div>
        </div>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`navbar-link ${location.pathname === item.to ? 'active' : ''}`}
            onClick={() => setShowMenu(false)}
          >
            {item.label}
          </Link>
        ))}

        {/* Admin link only visible to admin role */}
        {user && user.role === 'admin' && (
          <Link to="/admin" className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => setShowMenu(false)}>Admin</Link>
        )}

        {/* Auth actions */}
        <div className="navbar-contact" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, color: '#0f172a' }}>@drivehub</div>
          <div style={{ fontSize: 14, color: '#0f172a' }}>02-038-5222</div>
          {user ? (
            <>
              <span className="navbar-link" style={{ cursor: 'default' }}>{user.username}</span>
              <button className="navbar-link" onClick={() => { logout(); setShowMenu(false); }} style={{ background: 'transparent', border: 'none', padding: 0 }}>ออกจากระบบ</button>
            </>
          ) : (
            <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setShowMenu(false)}>เข้าสู่ระบบ</Link>
          )}
        </div>
      </div>

      {/* Hamburger */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
