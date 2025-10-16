import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NavbarLogin from '../../components/Navbar';
import ScrollToTopButton from '../../components/ScrollToTopButton';

// Styles (ปรับปรุงให้ตรงกับดีไซน์ในรูปภาพ)
const styles = {
  pageContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh',
    backgroundColor: '#f8fafc' // พื้นหลังสีอ่อน
  },
  // ส่วน Header Banner สีน้ำเงินเข้ม
  headerBanner: {
    backgroundColor: '#0d47a1', // สีน้ำเงินเข้ม (Deep Blue)
    height: '250px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  // Container สำหรับ Profile Card และ Content
  mainContentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '0 16px',
    marginTop: '-150px', // เลื่อน Card ขึ้นไปทับ Banner
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    // ปรับให้เป็นแนวตั้งเมื่อหน้าจอแคบ
    '@media (maxWidth: 768px)': {
      flexDirection: 'column',
      marginTop: '-100px',
    }
  },
  // Profile Card ด้านซ้าย
  profileCard: {
    flexShrink: 0, 
    width: '300px',
    padding: '16px',
    paddingTop: '100px', // เว้นพื้นที่ด้านบนสำหรับ Avatar
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    position: 'relative',
    textAlign: 'center',
    marginBottom: '32px',
    // ปรับความกว้างสำหรับมือถือ
    '@media (maxWidth: 768px)': {
      width: '100%',
    }
  },
  // Avatar Container
  avatarContainer: {
    position: 'absolute',
    top: '-70px', // ตำแหน่งให้ลอยอยู่เหนือ Card
    left: '50%',
    transform: 'translateX(-50%)',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    backgroundColor: '#bbdefb', // สีฟ้าอ่อน
    border: '6px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { 
    // ในรูปเป็น Icon ผู้ใช้ แต่ใช้ตัวอักษรแรกตามโค้ดเดิมของคุณ
    width: '100%', 
    height: '100%', 
    borderRadius: '50%', 
    backgroundColor: '#64b5f6', // สีฟ้ากลาง
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    color: '#fff',
    overflow: 'hidden',
  },
  // ปุ่มดินสอแก้ไขโปรไฟล์
  editIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: '#64b5f6',
    fontSize: '18px',
    textDecoration: 'none',
  },
  // ส่วน Content ด้านขวา
  rightContent: {
    flexGrow: 1,
    paddingTop: '20px',
    minHeight: '400px', // กำหนดความสูงขั้นต่ำเพื่อความสวยงาม
  },
  // Tab Bar
  tabBar: {
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '0',
    marginBottom: '20px',
    display: 'flex',
  },
  tabItem: {
    fontWeight: '600',
    color: '#0d47a1',
    borderBottom: '2px solid #0d47a1', // เส้นใต้สีน้ำเงิน
    padding: '0 4px 8px 4px',
    marginRight: '20px',
    fontSize: '18px',
  },
  
  // Style สำหรับ Footer เดิม
  footer: { background: '#eef2ff', padding: '2rem 1rem', marginTop: 28 },
  footerContent: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 },
  footerTitle: { color: '#0b74a6' },
  footerLink: { color: '#334155', listStyle: 'none', padding: 0 },
  footerContact: { color: '#334155' },
  appButtonApple: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#000', borderRadius: 6, color: '#fff', textDecoration: 'none', fontWeight: 600 },
  appButtonGoogle: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#34A853', borderRadius: 6, color: '#fff', textDecoration: 'none', fontWeight: 600 },
  footerBottom: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 13 },
};

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ข้อมูลจำลองสำหรับวันที่เข้าร่วมและเรตติ้ง
  const memberSince = '16 ตุลาคม 2025'; 
  const rating = 4; // สมมติ 4 ดาว
  const username = user?.username || 'ผู้ใช้ Klick Drive';

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        กรุณาเข้าสู่ระบบ
      </div>
    );
  }

  // ฟังก์ชันสร้างดาว (Star Rating)
  const renderStars = (count) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span key={i} style={{ color: i <= count ? '#ffc107' : '#e0e0e0', fontSize: '20px' }}>
          ★
        </span>
      );
    }
    return <div style={{ marginBottom: '16px' }}>{stars}</div>;
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navbar แบบซ่อนเมนูล่าง */}
      <NavbarLogin hideBottom={true} />

      {/* Header Banner สีน้ำเงิน */}
      <div style={styles.headerBanner}>
        {/* อาจจะใส่ลวดลายตามรูปภาพ */}
      </div>

      {/* Main Content Wrapper */}
      <div style={styles.mainContentWrapper}>
        
        {/* Profile Card (ซ้าย) */}
        <div style={styles.profileCard}>
          <Link to="/customer/edit-profile" style={styles.editIcon} title="แก้ไขโปรไฟล์">
            <span>✏️</span>
         </Link>

          <div style={styles.avatarContainer}>
            <div style={styles.avatarIcon}>
              {username.charAt(0).toUpperCase()}
            </div>
          </div>

          <h3 style={{ margin: '16px 0 4px 0', fontSize: '22px', color: '#1e293b' }}>
            {username}
          </h3>
          
          
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '10px' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>เป็นสมาชิกเมื่อ</p>
            <p style={{ margin: 0, color: '#0d47a1', fontSize: '14px', fontWeight: '500' }}>
              {memberSince}
            </p>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={styles.rightContent}>
          <h1 style={{ fontSize: '28px', color: '#1e293b', margin: '0 0 16px 0' }}>
            งานของ {username}
          </h1>
          
          <div style={styles.tabBar}>
            <span style={styles.tabItem}>รีวิวจากฟรีแลนซ์</span>
            {/* สามารถเพิ่ม Tab อื่นๆ ได้ */}
          </div>

          {/* ส่วนแสดงเนื้อหาตาม Tab */}
          
        </div>
      </div>

      {/* FOOTER - KEEP ORIGINAL STYLE */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h4 style={styles.footerTitle}>บริการลูกค้า</h4>
            <ul style={styles.footerLink}>
              <li>การรับประกันบริการ</li>
              <li>ข้อมูลบริการเพิ่มเติม</li>
              <li>ติดต่อเรา</li>
            </ul>
          </div>
          <div>
            <h4 style={styles.footerTitle}>เกี่ยวกับ</h4>
            <ul style={styles.footerLink}>
              <li>เกี่ยวกับ Klick Drive</li>
              <li>ร่วมงานกับเรา</li>
              <li><Link to="/terms" style={{ color: 'inherit' }}>ข้อกำหนดและเงื่อนไข</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={styles.footerTitle}>ช่องทางติดต่อ</h4>
            <div style={styles.footerContact}>โทร 02-038-5222 • Line: @drivehub • Email: contact@drivehub.com</div>
          </div>
          <div>
            <h4 style={styles.footerTitle}>ดาวน์โหลดแอพ</h4>
            <p style={{ color: '#334155', fontSize: 14, marginBottom: 8 }}>เช่ารถสะดวกยิ่งขึ้นด้วยมือถือ</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" style={styles.appButtonApple}>
                <img src="/images/apple-logo.png" alt="App Store" style={{ width: 20, height: 20 }} /> App Store
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={styles.appButtonGoogle}>
                <img src="/images/google-play-logo.png" alt="Google Play" style={{ width: 20, height: 20 }} /> Google Play
              </a>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          © {new Date().getFullYear()} Klick Drive — All rights reserved
          <div style={{ marginTop: 6, fontSize: 12 }}>
            <Link to="/privacy" style={{ color: '#64748b', marginRight: 12, textDecoration: 'underline dotted' }}>นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms" style={{ color: '#64748b', textDecoration: 'underline dotted' }}>ข้อกำหนดการให้บริการ</Link>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
};

export default ProfilePage;