import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* 🔙 ปุ่มกลับ */}
      <div style={styles.breadcrumb}>
        <span
          onClick={() => navigate('/customer/profile')}
          style={styles.link}
        >
          โปรไฟล์
        </span>
        <span style={{ color: '#999' }}> / </span>
        <span style={{ color: '#333', fontWeight: 600 }}>ตั้งค่าบัญชี</span>
      </div>

      {/* 🧩 เนื้อหาหลัก */}
      <div style={styles.card}>
        <h2 style={styles.title}>⚙️ ตั้งค่าบัญชี</h2>
        <p style={styles.desc}>
          จัดการข้อมูลส่วนตัว ความปลอดภัย และการแจ้งเตือนของบัญชีคุณ
        </p>

        {/* ตัวอย่าง section ตั้งค่า */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>การเข้าสู่ระบบ</h3>
          <p style={styles.sectionText}>เปลี่ยนรหัสผ่าน หรือจัดการวิธีเข้าสู่ระบบ</p>
          <button
            style={styles.button}
            onClick={() => navigate('/customer/edit-profile')}
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>การแจ้งเตือน</h3>
          <p style={styles.sectionText}>ตั้งค่ารับอีเมลหรือข้อความจากระบบ</p>
          <button style={styles.button}>ตั้งค่าการแจ้งเตือน</button>
        </div>
      </div>
    </div>
  );
};

// 🎨 สไตล์ทั้งหมด
const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  breadcrumb: {
    marginBottom: 24,
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    padding: '32px 24px',
    maxWidth: 600,
    margin: '0 auto',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  section: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    transition: 'background 0.2s',
  },
};

export default AccountSettingsPage;
