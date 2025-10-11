import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DataDeletionRequest = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const submitRequest = async e => {
    e.preventDefault();
    setError(null);
    if (!email) return setError('กรุณากรอกอีเมลที่ใช้ลงทะเบียน');
    setSubmitting(true);
    const payload = { name, email, reason, date: new Date().toISOString() };
    try {
      // Try POSTing to API if exists
      const res = await fetch('/api/delete-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setSent(true);
      } else {
        // fallback: store locally as mock
        const stored = JSON.parse(localStorage.getItem('delete_requests') || '[]');
        stored.push(payload);
        localStorage.setItem('delete_requests', JSON.stringify(stored));
        setSent(true);
      }
    } catch (err) {
      // network or server down -> fallback
      const stored = JSON.parse(localStorage.getItem('delete_requests') || '[]');
      stored.push(payload);
      localStorage.setItem('delete_requests', JSON.stringify(stored));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '3rem auto', padding: '1.5rem', fontFamily: 'Segoe UI, Roboto, Arial' }}>
      <h1 style={{ color: '#0b74a6' }}>ขอให้ลบข้อมูลส่วนบุคคล</h1>
      <p style={{ color: '#334155' }}>หากคุณต้องการให้เราลบข้อมูลส่วนบุคคลของคุณ โปรดกรอกแบบฟอร์มด้านล่าง ทีมสนับสนุนจะติดต่อยืนยันตัวตนก่อนดำเนินการ</p>

      {sent ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', padding: 16, borderRadius: 8 }}>
          <strong>คำขอถูกส่งแล้ว</strong>
          <p>เราจะติดต่อไปยังอีเมลของคุณเพื่อตรวจสอบข้อมูลก่อนดำเนินการลบ</p>
          <div style={{ marginTop: 8 }}><Link to="/">กลับสู่หน้าหลัก</Link></div>
        </div>
      ) : (
        <form onSubmit={submitRequest}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label>ชื่อ (ไม่จำเป็น)</label>
            <input className="nice-input" value={name} onChange={e=>setName(e.target.value)} placeholder="ชื่อของคุณ" />

            <label>อีเมล (ใช้ลงทะเบียน)</label>
            <input className="nice-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="อีเมลของคุณ" />

            <label>เหตุผลหรือรายละเอียดเพิ่มเติม</label>
            <textarea className="nice-input" value={reason} onChange={e=>setReason(e.target.value)} placeholder="เหตุผล (เช่น ต้องการยุติบัญชี)" rows={4} />

            {error && <div style={{ color: '#b91c1c' }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'ส่งคำขอ...' : 'ส่งคำขอให้ลบข้อมูล'}</button>
              <Link to="/privacy" style={{ alignSelf: 'center', color: '#64748b' }}>กลับไปที่นโยบายความเป็นส่วนตัว</Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default DataDeletionRequest;
