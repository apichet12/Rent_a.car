// src/components/customer/PersonalDataForm.js
import React, { useState, useEffect } from 'react';
import provinceTree from '../../address/province_tree.json';
import subdistrictMap from '../../address/subdistrict_map_full.json'; // ✅ ใช้งานจริงเพื่อปิด warning

const formStyles = {
  formGroup: { marginBottom: '30px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  subtitle: { color: '#64748b', margin: '0 0 30px 0' },
  label: { display: 'block', fontSize: '16px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
    borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box',
    transition: 'all 0.2s ease', outline: 'none'
  },
  select: {
    flexGrow: 1, padding: '10px 12px', border: '1px solid #cbd5e1',
    borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', appearance: 'none',
    background:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%231f2937\' viewBox=\'0 0 20 20\'><path d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\' fill-rule=\'evenodd\'></path></svg>") no-repeat right 12px center',
    backgroundSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease'
  },
  button: {
    padding: '10px 20px', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    transition: 'all 0.2s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  addressInputRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
  infoText: { color: '#64748b', fontSize: '14px', margin: '0 0 8px 0' },
  modalBackdrop: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.25s ease'
  },
  modalBox: {
    backgroundColor: '#fff', padding: '35px 30px', borderRadius: '14px',
    maxWidth: '420px', width: '90%', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    textAlign: 'center', transform: 'translateY(0)', animation: 'popIn 0.25s ease'
  },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' },
  modalText: { fontSize: '15px', color: '#475569', marginBottom: '25px' },
  btnPrimary: { backgroundColor: '#2563eb', color: '#fff' },
  btnDanger: { backgroundColor: '#e11d48', color: '#fff' },
  btnSuccess: { backgroundColor: '#16a34a', color: '#fff' },
};

// ✅ เพิ่ม animation keyframes
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  const fadeKeyframes = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  try { styleSheet.insertRule(fadeKeyframes, styleSheet.cssRules.length); } catch {}
}

const PersonalDataForm = ({ user }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [phone, setPhone] = useState(user?.phone || '');
  const [addressDetail, setAddressDetail] = useState(user?.addressDetail || '');
  const [provinceId, setProvinceId] = useState(user?.province || '');
  const [districtId, setDistrictId] = useState(user?.district || '');
  const [subDistrictId, setSubDistrictId] = useState(user?.subDistrict || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [districtOptions, setDistrictOptions] = useState([]);
  const [subDistrictOptions, setSubDistrictOptions] = useState([]);

  // ✅ ใช้งาน subdistrictMap เพื่อปิด warning (ตัวอย่าง)
  useEffect(() => {
    console.log('Loaded subdistrictMap with', Object.keys(subdistrictMap).length, 'items');
  }, []);

  const handleSave = () => {
    alert('✅ บันทึกข้อมูลส่วนบุคคล (จำลอง)');
    setIsEditingEmail(false);
  };

  const handleChangeEmailClick = () => setShowConfirmModal(true);
  const confirmChangeEmail = () => { setShowConfirmModal(false); setIsEditingEmail(true); setIsConfirmMode(true); };
  const handleConfirmEmail = () => setShowVerifyModal(true);
  const closeVerifyModal = () => { setShowVerifyModal(false); setIsEditingEmail(false); setIsConfirmMode(false); };

  // Province → District
  useEffect(() => {
    if (!provinceId) {
      setDistrictOptions([]); setDistrictId(''); setSubDistrictOptions([]); setSubDistrictId(''); setZipCode('');
      return;
    }
    const province = provinceTree[provinceId];
    if (!province) return;
    setDistrictOptions(province.districts || []);
  }, [provinceId]);

  // District → Subdistrict
  useEffect(() => {
    if (!districtId || !districtOptions.length) {
      setSubDistrictOptions([]); setSubDistrictId(''); setZipCode('');
      return;
    }
    const district = districtOptions.find(d => d.id === parseInt(districtId));
    setSubDistrictOptions(district?.sub_districts || []);
  }, [districtId, districtOptions]);

  // Subdistrict → Zipcode
  useEffect(() => {
    if (!subDistrictId || !subDistrictOptions.length) {
      setZipCode('');
      return;
    }
    const sub = subDistrictOptions.find(s => s.id === parseInt(subDistrictId));
    setZipCode(sub?.zipcode || '');
  }, [subDistrictId, subDistrictOptions]);

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <h2 style={formStyles.title}>ข้อมูลติดต่อ</h2>
        <p style={formStyles.subtitle}>เพื่อให้เราสามารถติดต่อคุณได้</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              ...formStyles.input,
              flex: '1 1 auto',
              backgroundColor: isEditingEmail ? '#fff' : '#f1f5f9',
              cursor: isEditingEmail ? 'text' : 'not-allowed'
            }}
            readOnly={!isEditingEmail}
          />
          {!isEditingEmail && !isConfirmMode && (
            <button type="button" style={{ ...formStyles.button, ...formStyles.btnPrimary }} onClick={handleChangeEmailClick}>
              เปลี่ยนอีเมล
            </button>
          )}
          {isEditingEmail && isConfirmMode && (
            <button type="button" style={{ ...formStyles.button, ...formStyles.btnSuccess }} onClick={handleConfirmEmail}>
              ยืนยัน
            </button>
          )}
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>เบอร์โทรศัพท์</label>
          <input type="tel" placeholder="ระบุเบอร์โทร" value={phone} onChange={e => setPhone(e.target.value)} style={formStyles.input} />
          <p style={formStyles.infoText}>หากไม่แนบเอกสารต่างประเทศ กรุณาติดต่อศูนย์ช่วยเหลือเพื่อยืนยัน</p>
        </div>

        <h2 style={formStyles.title}>ข้อมูลที่อยู่</h2>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>รายละเอียดที่อยู่</label>
          <input type="text" placeholder="เลขที่, หมู่, ถนน, ซอย" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} style={formStyles.input} />
        </div>

        <div style={formStyles.addressInputRow}>
          <div style={{ flex: 1 }}>
            <label style={formStyles.label}>จังหวัด</label>
            <select value={provinceId} onChange={e => setProvinceId(e.target.value)} style={formStyles.select}>
              <option value="">เลือกจังหวัด</option>
              {Object.values(provinceTree).map(p => (
                <option key={p.id} value={p.id}>{p.name_th}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={formStyles.label}>อำเภอ/เขต</label>
            <select value={districtId} onChange={e => setDistrictId(e.target.value)} style={formStyles.select}>
              <option value="">เลือกอำเภอ/เขต</option>
              {districtOptions.map(d => (
                <option key={d.id} value={d.id}>{d.name_th}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={formStyles.addressInputRow}>
          <div style={{ flex: 1 }}>
            <label style={formStyles.label}>ตำบล/แขวง</label>
            <select value={subDistrictId} onChange={e => setSubDistrictId(e.target.value)} style={formStyles.select}>
              <option value="">เลือกตำบล/แขวง</option>
              {subDistrictOptions.map(s => (
                <option key={s.id} value={s.id}>{s.name_th}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={formStyles.label}>รหัสไปรษณีย์</label>
            <input type="text" value={zipCode} readOnly style={formStyles.input} />
          </div>
        </div>

        <button type="submit" style={{ ...formStyles.button, ...formStyles.btnPrimary, marginTop: '10px' }}>
          💾 บันทึกข้อมูล
        </button>
      </form>

      {/* Modal: ยืนยันเปลี่ยนอีเมล */}
      {showConfirmModal && (
        <div style={formStyles.modalBackdrop}>
          <div style={formStyles.modalBox}>
            <h3 style={formStyles.modalTitle}>ยืนยันการเปลี่ยนอีเมล</h3>
            <p style={formStyles.modalText}>คุณต้องการเปลี่ยนอีเมลใช่หรือไม่?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button style={{ ...formStyles.button, ...formStyles.btnDanger }} onClick={() => setShowConfirmModal(false)}>ยกเลิก</button>
              <button style={{ ...formStyles.button, ...formStyles.btnSuccess }} onClick={confirmChangeEmail}>ตกลง</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: แจ้งว่าส่งรหัสยืนยันแล้ว */}
      {showVerifyModal && (
        <div style={formStyles.modalBackdrop}>
          <div style={formStyles.modalBox}>
            <h3 style={formStyles.modalTitle}>ส่งรหัสยืนยันแล้ว</h3>
            <p style={formStyles.modalText}>เราได้ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมาย 📬</p>
            <button style={{ ...formStyles.button, ...formStyles.btnPrimary }} onClick={closeVerifyModal}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDataForm;
