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
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customer', label: 'Customer' },
];

const Navbar = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <nav className="navbar">
      <span className="navbar-brand">ระบบเช่ารถออนไลน์</span>

      <div className={`navbar-links ${showMenu ? 'show' : ''}`}>
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
        {user ? (
          <>
            <span className="navbar-link" style={{ cursor: 'default' }}>{user.username}</span>
            <button className="navbar-link" onClick={() => { logout(); setShowMenu(false); }} style={{ background: 'transparent', border: 'none', padding: 0 }}>ออกจากระบบ</button>
          </>
        ) : (
          <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setShowMenu(false)}>เข้าสู่ระบบ</Link>
        )}
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
