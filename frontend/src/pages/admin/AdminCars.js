
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const AdminCars = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch cars from backend
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setCars(data || []);
    } catch (e) {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  // Add a new car
  const handleAdd = async () => {
    setError('');
    setSuccess('');
    if (!user || user.role !== 'admin') {
      setError('ต้องเป็นผู้ดูแลระบบเพื่อเพิ่มรถ');
      return;
    }
    if (!form.name || !form.price) {
      setError('กรุณากรอกชื่อและราคา');
      return;
    }
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUsername: user.username, car: { ...form, price: Number(form.price) } })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
        setSuccess('เพิ่มรถสำเร็จ!');
        fetchCars();
      } else {
        setError(data.message || 'ไม่สามารถเพิ่มรถได้');
      }
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    }
  };

  // Delete a car
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    if (!user || user.role !== 'admin') return;
    if (!window.confirm('ต้องการลบรถคันนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUsername: user.username })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setSuccess('ลบรถสำเร็จ!');
        fetchCars();
      } else {
        setError(data.message || 'ไม่สามารถลบได้');
      }
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    }
  };

  return (
    <div className="page-card" style={{ maxWidth: 600, margin: '0 auto', background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ef 100%)', boxShadow: '0 4px 24px #e0e7ef', borderRadius: 18, padding: 32 }}>
      <h2 style={{ color: '#1e293b', marginBottom: 0 }}>🚗 จัดการรถ (Admin)</h2>
      <p style={{ color: '#64748b', marginTop: 4, marginBottom: 24 }}>เพิ่ม/ลบรถ ดูรายการรถทั้งหมด</p>

      <div style={{ marginBottom: 24, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px #f1f5f9' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {error && <div style={{ color: '#ef4444', fontWeight: 500 }}>{error}</div>}
          {success && <div style={{ color: '#22c55e', fontWeight: 500 }}>{success}</div>}
          <input className="nice-input" style={{ fontSize: 16 }} placeholder="ชื่อรุ่นรถ *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="nice-input" style={{ fontSize: 16 }} placeholder="ราคา (บาท/วัน) *" type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input className="nice-input" style={{ fontSize: 16 }} placeholder="คำอธิบาย" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn-primary" style={{ flex: 1, fontSize: 16, padding: '10px 0' }} onClick={handleAdd}>➕ เพิ่มรถ</button>
            <button className="btn-ghost" style={{ flex: 1, fontSize: 16, padding: '10px 0' }} onClick={() => setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' })}>รีเซ็ต</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        {loading ? <div style={{ color: '#64748b', textAlign: 'center', fontSize: 18 }}>⏳ กำลังโหลด...</div> : (
          cars.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cars.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 2px 8px #f1f5f9', transition: 'box-shadow .2s', gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ color: '#64748b', fontSize: 15 }}>{c.desc || '-'} <span style={{ color: '#0ea5e9', fontWeight: 500 }}> {c.price} ฿/วัน</span></div>
                  </div>
                  <button className="btn-ghost" style={{ color: '#ef4444', fontWeight: 600, fontSize: 16, border: '1px solid #ef4444', borderRadius: 8, padding: '6px 18px', background: 'none', cursor: 'pointer', transition: 'background .2s' }} onClick={() => handleDelete(c.id)}>
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          ) : <div style={{ color: '#64748b', textAlign: 'center', fontSize: 18 }}>ยังไม่มีรถในระบบ</div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
