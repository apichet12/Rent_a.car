// src/pages/customer/AccountSecurity.js
import React from 'react';

const AccountSecurity = () => {
  const handleSetPassword = () => {
    alert('🔐 เปิดหน้าตั้งรหัสผ่าน (จำลอง)');
    // หรือ navigate ไปหน้าเปลี่ยนรหัสผ่านจริงถ้ามี
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('❗ การลบบัญชีจะลบข้อมูลทั้งหมด และไม่สามารถกู้คืนได้\n\nคุณแน่ใจหรือไม่?');
    if (confirmDelete) {
      alert('🗑️ บัญชีถูกลบเรียบร้อย (จำลอง)');
    }
  };

  const styles = {
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#64748b',
      marginBottom: '30px',
    },
    sectionBox: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    section: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
    },
    sectionLast: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
    },
    sectionTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
    },
    sectionText: {
      margin: '4px 0 0 0',
      fontSize: '14px',
      color: '#64748b',
    },
    buttonPrimary: {
      backgroundColor: '#1d4ed8',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    buttonDanger: {
      backgroundColor: '#ef4444',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <h2 style={styles.title}>จัดการบัญชี</h2>
      <p style={styles.subtitle}>ตั้งค่าข้อมูล และความปลอดภัยของบัญชี</p>

      <div style={styles.sectionBox}>
        {/* ตั้งรหัสผ่าน */}
        <div style={styles.section}>
          <div>
            <h3 style={styles.sectionTitle}>รหัสผ่าน</h3>
            <p style={styles.sectionText}>จัดการรหัสผ่านในระบบ fastwork</p>
          </div>
          <button onClick={handleSetPassword} style={styles.buttonPrimary}>
            ตั้งรหัสผ่าน
          </button>
        </div>

        {/* ลบบัญชี */}
        <div style={styles.sectionLast}>
          <div>
            <h3 style={styles.sectionTitle}>ลบบัญชี</h3>
            <p style={styles.sectionText}>
              การลบบัญชีนี้เป็นการยกเลิกการใช้งานถาวร คุณจะไม่สามารถกู้คืนบัญชีหรือข้อมูลส่วนตัวได้
            </p>
          </div>
          <button onClick={handleDeleteAccount} style={styles.buttonDanger}>
            ลบบัญชี
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
