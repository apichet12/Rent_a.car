// src/pages/customer/ProfilePage.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import NavbarLogin from '../../components/Navbar';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import Footer from '../../components/Footer';
import './ProfilePage.css';

// แปลงวันที่เป็นไทย (แก้ปัญหา TimeZone)
const formatThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' });
};

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  const username = user?.username || 'สมาชิก Rent a car with Katty';

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

      <Footer />

      <ScrollToTopButton />
    </div>
  );
};

export default ProfilePage;
