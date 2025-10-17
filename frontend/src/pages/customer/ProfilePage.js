// src/pages/customer/ProfilePage.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import NavbarLogin from '../../components/Navbar';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import './ProfilePage.css';

// แปลงวันที่เป็นไทย (แก้ปัญหา TimeZone)
const formatThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });
};

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  const username = user?.username || 'Klick Drive Member';

  // โหลด user จาก server
  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        const data = await res.json();
        if (data.success) {
          setUser(data);
        }
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, [username, setUser]);

  const memberSince = formatThaiDate(user?.createdAt);

  return (
    <div className="profile-page">
      <NavbarLogin hideBottom={true} />
      <div className="profile-banner"></div>

      <div className="profile-main">
        {/* ---- PROFILE CARD ---- */}
        <div className="profile-card">
          <Link to="/customer/edit-profile" className="edit-icon" title="แก้ไขโปรไฟล์">
            ✏️
          </Link>

          <div className="avatar-ring">
            <div className="avatar-container">
              <div className="avatar-icon">{username.charAt(0).toUpperCase()}</div>
            </div>
          </div>

          <h3 className="profile-name">{username}</h3>
          {/* ลบดาวออกตามคำขอ */}
          <p className="member-since">
            เป็นสมาชิกเมื่อ <span>{memberSince}</span>
          </p>
        </div>

        {/* ---- RIGHT CONTENT ---- */}
        <div className="profile-right">
          <h1 className="profile-title">บัญชีของ {username}</h1>
          <div className="tab-bar">
            <span className="tab-item active">รีวิวจากฟรีแลนซ์</span>
          </div>
          <p className="placeholder">ยังไม่มีรีวิวในขณะนี้</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <h4>บริการลูกค้า</h4>
            <ul>
              <li>การรับประกันบริการ</li>
              <li>ข้อมูลเพิ่มเติม</li>
              <li>ติดต่อเรา</li>
            </ul>
          </div>
          <div>
            <h4>เกี่ยวกับ</h4>
            <ul>
              <li>เกี่ยวกับ Klick Drive</li>
              <li>ร่วมงานกับเรา</li>
              <li>
                <Link to="/terms">ข้อกำหนดและเงื่อนไข</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>ช่องทางติดต่อ</h4>
            <p>โทร 02-038-5222 • Line: @drivehub • Email: contact@drivehub.com</p>
          </div>
          <div>
            <h4>ดาวน์โหลดแอพ</h4>
            <p>เช่ารถสะดวกยิ่งขึ้นด้วยมือถือ</p>
            <div className="app-buttons">
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="app-btn apple">
                <img src="/images/apple-logo.png" alt="App Store" /> App Store
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="app-btn google">
                <img src="/images/google-play-logo.png" alt="Google Play" /> Google Play
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Klick Drive — All rights reserved
          <div>
            <Link to="/privacy">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms">ข้อกำหนดการให้บริการ</Link>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
};

export default ProfilePage;
