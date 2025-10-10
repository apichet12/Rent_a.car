import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

// top-level menu is the Drivehub-style center menu; legacy nav items removed per design

const Navbar = () => {
  // Keeping showMenu for mobile toggle
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo192.png" alt="Rent a car logo" style={{ width: 40, height: 40 }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span className="navbar-brand">Rent a car with Catty Pa Plearn</span>
        </div>
      </div>

      <div className={`navbar-links ${showMenu ? 'show' : ''}`}>
            <div className="navbar-topmenu">
              <Link to="/cars" className="menu-item" onClick={() => setShowMenu(false)}>เช่ารถกับ Drivehub</Link>
              <Link to="/help" className="menu-item" onClick={() => setShowMenu(false)}>ความช่วยเหลือ</Link>
              <div className="menu-item dropdown">
                <button className="dropdown-toggle" onClick={() => setShowAuth(!showAuth)}>สมัครสมาชิก / ลงชื่อเข้าใช้ <span style={{ marginLeft: 6 }}>▾</span></button>
                {showAuth && (
                  <div className="dropdown-menu">
                    <Link to="/login" className="dropdown-item" onClick={() => { setShowMenu(false); setShowAuth(false); }}>เข้าสู่ระบบ</Link>
                    <Link to="/register" className="dropdown-item" onClick={() => { setShowMenu(false); setShowAuth(false); }}>สมัครสมาชิก</Link>
                  </div>
                )}
              </div>
            </div>
        {/* legacy nav removed - only center topmenu + contact remain */}

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
            <Link to="/login" className={`navbar-link`} onClick={() => setShowMenu(false)}>เข้าสู่ระบบ</Link>
          )}
        </div>
      </div>

      {/* Hamburger */}
          <div className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
    </nav>
  );
};

export default Navbar;
