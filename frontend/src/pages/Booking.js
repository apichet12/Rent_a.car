import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = state?.car;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!car) return (
    <div style={{padding:'2rem'}}>
      <h2>ไม่พบข้อมูลรถ</h2>
      <button onClick={()=>navigate('/')}>กลับไปหน้ารถ</button>
    </div>
  );

  const handleBooking = async () => {
    if (!name || !phone || !date) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/book/${car.id}`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ name, phone, date })
});

      const data = await res.json();
      if (res.ok) {
        const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        stored[car.id] = false;
        localStorage.setItem('cars_availability', JSON.stringify(stored));

        setMessage('จองรถสำเร็จ!');
        setTimeout(()=>navigate('/'), 2000);
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาดในการจอง');
      }

    } catch (err) {
      console.error(err);
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:'2rem', maxWidth:'600px', margin:'0 auto'}}>
      <h2>จองรถ / Booking</h2>
      <div style={{marginBottom:'1rem'}}>
        <img src={car.image} alt={car.name} style={{width:'100%', borderRadius:'12px', marginBottom:'12px'}} />
        <h3>{car.name}</h3>
        <div>ปี {car.year} | {car.seats} ที่นั่ง | {car.fuel}</div>
        <p>ราคา/วัน: {car.price.toLocaleString()} บาท</p>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        <input placeholder="ชื่อ-นามสกุล" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="เบอร์โทรศัพท์" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button onClick={handleBooking} disabled={loading} style={{padding:'10px', borderRadius:'8px', background:'linear-gradient(90deg,#06b6d4,#4f46e5)', color:'#fff', fontWeight:'bold', cursor:'pointer'}}>
          {loading ? 'กำลังจอง...' : 'จองรถ'}
        </button>
        {message && <p>{message}</p>}
      </div>

      <button onClick={()=>navigate('/')} style={{marginTop:'20px'}}>กลับไปหน้ารถ</button>
    </div>
  );
};

export default Booking;
