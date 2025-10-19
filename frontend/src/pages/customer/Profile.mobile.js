// src/pages/customer/Profile.mobile.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import MobileNav from '../../components/mobile/MobileNav';
import LoadingOverlay from '../../components/LoadingOverlay';
import './Profile.mobile.css';

const formatThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });
};

const ProfileMobile = () => {
  const { user, setUser } = useContext(AuthContext);
  const username = user?.username || '';
  const memberSince = formatThaiDate(user?.createdAt);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        const data = await res.json();
        if (data.success) setUser(data);
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, [username, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="mobile-profile-page" style={{ paddingBottom: 64 }}>
      <LoadingOverlay visible={false} />

      {/* Header */}
      {user ? (
        <div className="profile-header">
          <div className="profile-user">
            <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="profile-name">
              <div className="username">{username}</div>
              <div className="view-profile">ดูโปรไฟล์</div>
            </div>
          </div>
          <Link to="/settings" className="profile-settings">⚙️</Link>
        </div>
      ) : (
        <div className="login-notice-wrapper">
          <div className="login-notice">
            คุณยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบ หรือสมัครสมาชิก
          </div>
          <div className="profile-header login-register-header">
            <Link to="/login" className="btn-login">เข้าสู่ระบบ</Link>
            <Link to="/register" className="btn-register">สมัครสมาชิก</Link>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="menu-items">
        <div className="menu-item">📋 สมัครเป็นฟรีแลนซ์</div>
        <div className="menu-item">🌐 Language: ไทย</div>
        <div className="menu-item">
          ⚙️ การตั้งค่า
          <div className="submenu">
            - ตั้งค่าบัญชี<br />
            - จัดการการใช้งานข้อมูล
          </div>
        </div>
        <div className="menu-item">
          ❓ ศูนย์ช่วยเหลือ
          <div className="submenu">
            - ติดต่อเจ้าหน้าที่<br />
            - คำถามที่พบบ่อย
          </div>
        </div>
      </div>

      {/* Logout + Member Since */}
{user && (
  <div className="logout-wrapper">
    <div className="logout-btn" onClick={handleLogout}>
      🔓 ออกจากระบบ
    </div>
    <div className="member-since">
      เป็นสมาชิกเมื่อ {memberSince}
    </div>
  </div>
)}

      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default ProfileMobile;
