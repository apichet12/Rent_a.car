// นำเข้า React และ Hooks ที่จำเป็น รวมถึง Context สำหรับข้อมูลผู้ใช้
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // ดึงข้อมูลผู้ใช้จาก context
import { useNavigate } from 'react-router-dom'; // สำหรับนำทางหน้า

const CustomerProfile = () => {
  const { user, loading, logout } = useContext(AuthContext); // ดึงข้อมูล user, loading และ logout
  const [open, setOpen] = useState(false); // สถานะเปิด/ปิด dropdown
  const dropdownRef = useRef(); // ใช้ตรวจจับ click นอก dropdown
  const navigate = useNavigate(); // ฟังก์ชันนำทาง

  // ตรวจจับ click นอก dropdown เพื่อปิด
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ถ้ากำลังโหลดแสดงข้อความกลางหน้า
  if (loading) return <div style={centerCard}>กำลังโหลด...</div>;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Avatar ของผู้ใช้ */}
      <div
        onClick={() => setOpen(!open)} // toggle dropdown
        style={avatarStyle} // style avatar
      >
        {user.username?.charAt(0).toUpperCase() || 'U'} {/* แสดงตัวแรกของ username */}
      </div>

      {/* Dropdown เมนู */}
      {open && (
        <div style={dropdownStyle}>
          {/* Header ของ dropdown */}
          <div style={dropdownHeader}>
            <div style={{ ...textEllipsis, fontSize: 16, fontWeight: 600, color: '#000' }}>{user.username}</div>
            <div style={{ ...textEllipsis, fontSize: 12, color: '#000', marginBottom: 4 }}>
              {user.email || '-'}
            </div>
            {/* ลิงก์แก้ไขโปรไฟล์ */}
            <div
              onClick={() => navigate('/customer/profile')}
              style={{
                fontSize: 12,
                color: '#6488e5ff',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              แก้ไขโปรไฟล์
            </div>
          </div>

          <div style={divider} /> {/* เส้นแบ่ง */}

          {/* Menu Items แบบแนวตั้ง และ scroll ได้ถ้าเยอะ */}
          <div style={menuContainerStyle}>
  <MenuItem label="ตั้งค่าบัญชี" onClick={() => navigate('/customer/edit-profile')} />
  <MenuItem label="ข้อความและออเดอร์" />
  <MenuItem label="คูปองส่วนลด" />
  <MenuItem label="งานที่ชอบ" />
<MenuItem
  label="ออกจากระบบ"
  onClick={() => {
    logout();               // เรียก logout
    navigate('/');          // หรือ navigate('/customer/edit-profile') ถ้าต้องการไปหน้าจัดการบัญชี
  }}
/>
</div>
        </div>
      )}
    </div>
  );
};

// ==================== Styles ====================

// ข้อความตรงกลางหน้า ใช้สำหรับ loading หรือ login prompt
const centerCard = { textAlign: 'center', padding: 32 };

// Avatar style
const avatarStyle = {
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: '#3b82f6',
  color: '#fff',
  fontWeight: '500',
  fontSize: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

// Dropdown container
const dropdownStyle = {
  position: 'absolute',
  top: 60,
  right: 0,
  width: 250,
  background: '#fff',
  borderRadius: 28,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  padding: 11,
  zIndex: 1000,
  animation: 'scaleFadeIn 0.25s ease-out forwards',
};

const dropdownHeader = { padding: '6px 0' }; 
const divider = { height: 1, background: '#e2e8f0', margin: '6px 0' }; 
const textEllipsis = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

// Container สำหรับ MenuItem ให้เรียงแนวตั้ง และ scroll ได้
const menuContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 300, // ถ้า item เยอะเกินจะ scroll
  overflowY: 'auto',
  paddingRight: 4,
};

// Component สำหรับแต่ละ menu item
const MenuItem = ({ label, value, badge, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 8px',
      cursor: 'pointer',
      color: '#000', // สีดำ
      fontSize: 12, // ขนาดไม่ใหญ่
      fontWeight: 500,
      borderRadius: 8,
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f0f0f0'; // hover เทาอ่อน
      e.currentTarget.style.transform = 'translateX(2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.transform = 'translateX(0)';
    }}
  >
    <span style={{ color: '#474c52ff', fontSize: 18,  }}>{label}</span>
    {value && <span style={{ fontWeight: 400, color: '#000' }}>{value}</span>}
    {badge && (
      <span
        style={{
          background: '#000',
          color: '#fff',
          borderRadius: 12,
          padding: '2px 6px',
          fontSize: 10,
          marginLeft: 6,
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

export default CustomerProfile;
