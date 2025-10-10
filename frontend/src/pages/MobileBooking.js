import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ACCENT_COLOR = '#007BFF';
const LIGHT_BG = '#F7F9FC';
const TEXT_COLOR = '#1A202C';

const MobileBooking = () => {
  const { state } = useLocation();
  const preCar = state?.car || null;

  const [form, setForm] = useState({
    car: preCar ? preCar.name : '',
    pickupDate: '',
    dropoffDate: '',
    name: '',
    phone: ''
  });

  const pickup = form.pickupDate ? new Date(form.pickupDate) : null;
  const dropoff = form.dropoffDate ? new Date(form.dropoffDate) : null;
  const durationDays =
    pickup && dropoff && dropoff > pickup
      ? Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = preCar?.price * durationDays || 0;

  useEffect(() => {
    if (preCar) setForm(f => ({ ...f, car: preCar.name }));
  }, [preCar]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.pickupDate || !form.dropoffDate || durationDays <= 0) {
      return alert('กรุณาเลือกช่วงวันรับและวันคืนรถให้ถูกต้อง');
    }

    try {
      const bookingData = {
        ...form,
        carId: preCar?.id || null,
        duration: `${form.pickupDate} ถึง ${form.dropoffDate} (${durationDays} วัน)`,
        total: totalPrice,
        createdAt: new Date().toISOString()
      };
      delete bookingData.pickupDate;
      delete bookingData.dropoffDate;

      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      if (preCar?.id) {
        const map = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        map[preCar.id] = false;
        localStorage.setItem('cars_availability', JSON.stringify(map));
      }

      alert('✅ จองรถสำเร็จ!');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div style={{ padding: 16, background: LIGHT_BG, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT_COLOR, marginBottom: 16 }}>
        📝 จองรถ (Mobile)
      </h2>

  <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontWeight: 600, marginBottom: 12, color: TEXT_COLOR }}>ช่วงเวลาเช่า 🗓️</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DateInput label="วันรับรถ" name="pickupDate" value={form.pickupDate} onChange={handleChange} />
          <DateInput label="วันคืนรถ" name="dropoffDate" value={form.dropoffDate} onChange={handleChange} />
        </div>
        <div style={{ marginTop: 8, fontWeight: 600, color: durationDays > 0 ? TEXT_COLOR : 'red' }}>
          {durationDays > 0 ? `ระยะเวลาเช่าทั้งหมด: ${durationDays} วัน` : 'กรุณาเลือกวันรับและวันคืนรถ'}
        </div>

        <h3 style={{ fontWeight: 600, margin: '16px 0 8px 0', color: TEXT_COLOR }}>ข้อมูลผู้จอง 📞</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextInput label="ชื่อผู้จอง" name="name" value={form.name} onChange={handleChange} placeholder="เช่น สมชาย ใจดี" />
          <TextInput label="เบอร์โทร" name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXXXXXX" />
          <TextInput label="ชื่อรถ" name="car" value={form.car} onChange={handleChange} placeholder="ระบุชื่อรถ" disabled={!!preCar} />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: 16, width: '100%', padding: 12, fontWeight: 700, borderRadius: 8, fontSize: 16 }}>
          💸 ยืนยันการจอง
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <BookingListMobile />
      </div>
    </div>
  );
};

// --- Subcomponents ---
const DateInput = ({ label, name, value, onChange }) => (
  <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</label>
    <input className="nice-input" type="date" name={name} value={value} onChange={onChange} />
  </div>
);

const TextInput = ({ label, name, value, onChange, placeholder, disabled }) => (
  <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</label>
    <input className="nice-input" type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />
  </div>
);

const BookingListMobile = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem('bookings') || '[]'));
    } catch {
      setList([]);
    }
  }, []);

  if (!list.length)
    return (
      <div style={{ textAlign: 'center', padding: 16, background: LIGHT_BG, borderRadius: 8, color: '#555' }}>
        ยังไม่มีการจอง
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      {list.map((b, i) => (
        <div key={i} style={{ padding: 12, borderRadius: 8, background: '#EBF5FF', borderLeft: `4px solid ${ACCENT_COLOR}` }}>
          <div style={{ fontWeight: 600, color: ACCENT_COLOR }}>{b.car}</div>
          <div style={{ fontSize: 12, color: '#555' }}>🗓️ {b.duration} | 👤 {b.name} | 📞 {b.phone}</div>
        </div>
      ))}
    </div>
  );
};

export default MobileBooking;
