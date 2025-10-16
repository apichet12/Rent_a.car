// src/pages/customer/EditProfilePage.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import provinceTree from '../../address/province_tree.json';
import subdistrictMap from '../../address/subdistrict_map_full.json';
import AccountSecurity from './AccountSecurity';

// 🌈 ปรับโทนสี + ความโค้ง + เงา
const colors = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  accent: '#16a34a',
  bg: '#f8fafc',
  text: '#1e293b',
  gray: '#64748b',
  border: '#e2e8f0',
};

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: colors.bg,
    padding: '20px 20px 40px 20px',
    animation: 'fadeIn 0.3s ease',
  },
  mainContentWrapper: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  sidebar: {
    flexShrink: 0,
    width: '280px',
    backgroundColor: '#ffffff',
    padding: '30px 0',
    borderRight: `1px solid ${colors.border}`,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 32px',
    color: colors.gray,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    borderLeft: '4px solid transparent',
    fontWeight: '500',
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
    color: colors.primary,
    fontWeight: '600',
    borderLeft: `4px solid ${colors.primary}`,
    paddingLeft: '28px',
  },
  menuItemHover: {
    backgroundColor: '#f1f5f9',
  },
  menuIcon: { marginRight: '12px', fontSize: '18px' },
  contentArea: {
    flexGrow: 1,
    padding: '40px',
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: colors.text,
    margin: '0 0 8px 0',
  },
  subtitle: { color: colors.gray, margin: '0 0 30px 0' },
  formGroup: { marginBottom: '30px' },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    color: colors.text,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    transition: 'border-color 0.2s',
  },
  select: {
    flexGrow: 1,
    padding: '10px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    cursor: 'pointer',
    background:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%231f2937\' viewBox=\'0 0 20 20\'><path d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\'/></svg>") no-repeat right 12px center',
    backgroundSize: '12px',
    appearance: 'none',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
    transition: 'all 0.2s ease',
  },
  addressInputRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
  infoText: { color: colors.gray, fontSize: '14px', margin: '0 0 8px 0' },
};

// 🧩 Modal styles
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  animation: 'fadeIn 0.2s ease',
};

const modalBox = {
  backgroundColor: '#fff',
  borderRadius: '14px',
  padding: '30px 35px',
  width: '380px',
  textAlign: 'center',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  animation: 'scaleUp 0.25s ease',
};

const modalButton = {
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalButtonCancel = {
  ...modalButton,
  backgroundColor: '#e5e7eb',
  color: '#1e293b',
};

const modalButtonConfirm = {
  ...modalButton,
  backgroundColor: colors.primary,
  color: '#fff',
};

// ✏️ AccountDataForm (เหมือนเดิม เพิ่ม hover effect)
const AccountDataForm = ({ user, username, displayName, setUsername, setDisplayName }) => (
  <>
    <h2 style={styles.title}>ข้อมูลบัญชี</h2>
    <p style={styles.subtitle}>กำหนดข้อมูลเบื้องต้นของคุณ</p>

    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 0 3px #93c5fd',
        }}
      >
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#dbeafe' }} />
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: colors.primary,
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          ✏️
        </div>
      </div>
    </div>

    <form
      onSubmit={e => {
        e.preventDefault();
        alert('บันทึกข้อมูลบัญชีแล้ว (จำลอง)');
      }}
    >
      <div style={styles.formGroup}>
        <label style={styles.label}>ชื่อผู้ใช้ (Username)</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>ชื่อที่ใช้แสดงในระบบ</label>
        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} style={styles.input} />
      </div>

      <button type="submit" style={styles.buttonPrimary}>
        บันทึก
      </button>
    </form>
  </>
);

// 🧍‍♀️ PersonalDataForm (เหมือนเดิม เพิ่ม modal และ animation)
const PersonalDataForm = ({ user }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressDetail, setAddressDetail] = useState(user?.addressDetail || '');
  const [province, setProvince] = useState(user?.province || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [subDistrict, setSubDistrict] = useState(user?.subDistrict || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [districtOptions, setDistrictOptions] = useState([]);
  const [subDistrictOptions, setSubDistrictOptions] = useState([]);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!province) return setDistrictOptions([]);
    const prov = Object.values(provinceTree).find(p => p.id === parseInt(province));
    setDistrictOptions(prov?.districts || []);
  }, [province]);

  useEffect(() => {
    if (!district) return setSubDistrictOptions([]);
    const dist = districtOptions.find(d => d.id === parseInt(district));
    setSubDistrictOptions(dist?.sub_districts || []);
  }, [district, districtOptions]);

  useEffect(() => {
    if (subDistrict) {
      const zip = subdistrictMap[subDistrict]?.zipcode || '';
      setZipCode(zip);
    } else {
      setZipCode('');
    }
  }, [subDistrict]);

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          alert('บันทึกข้อมูลส่วนบุคคลแล้ว (จำลอง)');
        }}
      >
        <h2 style={styles.title}>ข้อมูลส่วนบุคคล</h2>
        <p style={styles.subtitle}>กรอกข้อมูลติดต่อและที่อยู่ของคุณ</p>

        <div style={{ ...styles.formGroup, display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              ...styles.input,
              flex: '1 1 auto',
              backgroundColor: isEditingEmail ? '#fff' : '#f1f5f9',
              cursor: isEditingEmail ? 'text' : 'not-allowed',
            }}
            readOnly={!isEditingEmail}
          />
          {!isEditingEmail ? (
            <button type="button" style={styles.buttonPrimary} onClick={() => setShowConfirmModal(true)}>
              เปลี่ยนอีเมล
            </button>
          ) : (
            <button
              type="button"
              style={{ ...styles.buttonPrimary, backgroundColor: colors.accent }}
              onClick={() => {
                setShowOtpModal(true);
                setIsEditingEmail(false);
              }}
            >
              ยืนยัน
            </button>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>เบอร์โทรศัพท์</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>ที่อยู่</label>
          <input type="text" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.addressInputRow}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>จังหวัด</label>
            <select value={province} onChange={e => setProvince(e.target.value)} style={styles.select}>
              <option value="">เลือกจังหวัด</option>
              {Object.values(provinceTree).map(p => (
                <option key={p.id} value={p.id}>{p.name_th}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>อำเภอ</label>
            <select value={district} onChange={e => setDistrict(e.target.value)} style={styles.select}>
              <option value="">เลือกอำเภอ</option>
              {districtOptions.map(d => (
                <option key={d.id} value={d.id}>{d.name_th}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.addressInputRow}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>ตำบล</label>
            <select value={subDistrict} onChange={e => setSubDistrict(e.target.value)} style={styles.select}>
              <option value="">เลือกตำบล</option>
              {subDistrictOptions.map(s => (
                <option key={s.id} value={s.id}>{s.name_th}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>รหัสไปรษณีย์</label>
            <input type="text" value={zipCode} readOnly style={styles.input} />
          </div>
        </div>

        <button type="submit" style={styles.buttonPrimary}>
          บันทึก
        </button>
      </form>

      {/* 🧩 Modal ยืนยันเปลี่ยนอีเมล */}
      {showConfirmModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>ยืนยันการเปลี่ยนอีเมล</h3>
            <p>คุณต้องการเปลี่ยนอีเมลใช่หรือไม่?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirmModal(false)} style={modalButtonCancel}>
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setIsEditingEmail(true);
                }}
                style={modalButtonConfirm}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧩 Modal OTP */}
      {showOtpModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>ส่งรหัสยืนยันแล้ว</h3>
            <p>กรอกรหัสที่ส่งไปยังอีเมลของคุณ</p>
            <input
              type="text"
              placeholder="รหัส 6 หลัก"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{
                ...styles.input,
                textAlign: 'center',
                fontSize: '18px',
                marginTop: '10px',
                letterSpacing: '4px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowOtpModal(false)} style={modalButtonCancel}>
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  alert('ยืนยันรหัสสำเร็จ 🎉');
                  setShowOtpModal(false);
                }}
                style={modalButtonConfirm}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 🌟 Main Page
const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [username, setUsername] = useState(user?.username || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountDataForm user={user} username={username} displayName={displayName} setUsername={setUsername} setDisplayName={setDisplayName} />;
      case 'personal':
        return <PersonalDataForm user={user} />;
      case 'security':
        return <AccountSecurity />;
      default:
        return <PersonalDataForm user={user} />;
    }
  };

  const getMenuItemStyle = tabName =>
    activeTab === tabName
      ? { ...styles.menuItem, ...styles.menuItemActive }
      : styles.menuItem;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContentWrapper}>
        <div style={styles.sidebar}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.text, padding: '0 30px', marginBottom: '10px' }}>
            บัญชีของคุณ
          </h3>

          <div onClick={() => setActiveTab('account')} style={getMenuItemStyle('account')}>
            <span style={styles.menuIcon}>👤</span> ข้อมูลบัญชี
          </div>
          <div onClick={() => setActiveTab('personal')} style={getMenuItemStyle('personal')}>
            <span style={styles.menuIcon}>📝</span> ข้อมูลบุคคล
          </div>
          <div onClick={() => setActiveTab('security')} style={getMenuItemStyle('security')}>
            <span style={styles.menuIcon}>🔒</span> จัดการบัญชี
          </div>
        </div>

        <div style={styles.contentArea}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default EditProfilePage;
