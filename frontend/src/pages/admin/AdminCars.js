import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// using same origin /api

const AdminCars = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setCars(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleAdd = async () => {
    setError('');
    if (!user || user.role !== 'admin') { setError('ต้องเป็นผู้ดูแลระบบเพื่อเพิ่มรถ'); return; }
    if (!form.name || !form.price) { setError('กรุณากรอกชื่อและราคา'); return; }
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUsername: user.username, car: { ...form, price: Number(form.price) } })
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' });
        fetchCars();
      } else {
        setError(data.message || 'ไม่สามารถเพิ่มรถได้');
      }
    } catch (e) {
      console.error(e);
      setError('เกิดข้อผิดพลาดติดต่อ server');
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'admin') return;
  if (!window.confirm('ต้องการลบรถคันนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminUsername: user.username }) });
      const data = await res.json();
      if (data.success) fetchCars(); else alert(data.message || 'ไม่สามารถลบได้');
    } catch (e) { console.error(e); alert('เกิดข้อผิดพลาด'); }
  };

  return (
    <div className="page-card">
      <h2>จัดการรถ (แอดมิน)</h2>
      <p style={{ color: '#6b7280' }}>เพิ่ม/ลบ รถ และดูรายการรถทั้งหมด</p>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          <input className="nice-input" placeholder="ชื่อรุ่นรถ" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="nice-input" placeholder="ราคา (บาท/วัน)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input className="nice-input" placeholder="คำอธิบาย" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={handleAdd}>เพิ่มรถ</button>
            <button className="btn-ghost" onClick={() => setForm({ name: '', price: '', seats: 4, fuel: 'เบนซิน', desc: '' })}>รีเซ็ต</button>
          </div>
        </div>
      </div>

      <div>
        {loading ? <div>กำลังโหลด...</div> : (
          cars.length ? cars.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{c.desc || '-'} — {c.price} ฿/วัน</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => handleDelete(c.id)}>ลบ</button>
              </div>
            </div>
          )) : <div style={{ color: '#6b7280' }}>ยังไม่มีรถ</div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
