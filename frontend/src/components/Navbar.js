import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const NavbarLogin = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDrivehub, setShowDrivehub] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40 }} />
          <span>Klick Drive</span>
        </Link>
      </div>

      {/* Links */}
      <div className="navbar-links">
        <div className="navbar-topmenu">
          {/* Drivehub Dropdown */}
          <div 
            className="menu-item dropdown hover-dropdown"
            onMouseEnter={() => setShowDrivehub(true)}
            onMouseLeave={() => setShowDrivehub(false)}
          >
            <button className="dropdown-toggle">เช่ารถกับ Drivehub ▾</button>
            <div className={`dropdown-menu ${showDrivehub ? 'show' : ''}`}>
              <Link className="dropdown-item" to="/cars?type=short">
                <div className="title">เช่ารถระยะสั้น 🚗</div>
                <div className="desc">เหมาะสำหรับใช้เป็นรายวันหรือทริปสั้น ๆ</div>
              </Link>
              <Link className="dropdown-item" to="/cars?type=long">
                <div className="title">เช่ารถระยะยาว 📅</div>
                <div className="desc">โปรแกรมเช่ารายสัปดาห์หรือรายเดือน พร้อมส่วนลดพิเศษ</div>
              </Link>
            </div>
          </div>

          {/* Help Dropdown */}
          <div 
            className="menu-item dropdown hover-dropdown"
            onMouseEnter={() => setShowHelpMenu(true)}
            onMouseLeave={() => setShowHelpMenu(false)}
          >
            <button className="dropdown-toggle">ความช่วยเหลือ ▾</button>
            <div className={`dropdown-menu ${showHelpMenu ? 'show' : ''}`}>
              <Link className="dropdown-item" to="/help/booking">
                <div className="title">วิธีการจองรถ 📖</div>
                <div className="desc">ขั้นตอนการค้นหา เลือกรถ และยืนยันการจอง</div>
              </Link>
              <Link className="dropdown-item" to="/help/docs">
                <div className="title">เอกสารการเช่ารถ 📄</div>
                <div className="desc">เอกสารที่ต้องเตรียม เช่น บัตรประชาชนและใบขับขี่</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side login */}
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
    </nav>
  );
};

export default NavbarLogin;
