import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/cars', label: 'เลือกรถ' },
  { to: '/gallery', label: 'แกลเลอรี่' },
  { to: '/booking', label: 'จองรถ' },
  { to: '/review', label: 'รีวิว' },
  { to: '/contact', label: 'ติดต่อ' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/login', label: 'เข้าสู่ระบบ' },
];

const Navbar = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

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
