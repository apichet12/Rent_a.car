import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const preCar = state?.car || null;
  const [form, setForm] = useState({
    car: preCar ? preCar.name : '',
    date: '',
    name: '',
    phone: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if(preCar) setForm(f => ({ ...f, car: preCar.name }));
  }, [preCar]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!acceptTerms) return alert("กรุณายอมรับข้อกำหนดก่อนดำเนินการ");
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({ ...form, carId: preCar?.id || null, createdAt: new Date().toISOString() });
      localStorage.setItem('bookings', JSON.stringify(bookings));
      const map = JSON.parse(localStorage.getItem('cars_availability') || '{}');
      if(preCar) map[preCar.id] = false;
      localStorage.setItem('cars_availability', JSON.stringify(map));
    } catch (err) { console.log(err) }
    alert('จองรถสำเร็จ!');
    navigate('/carlist');
  };

  return (
    <div style={{padding:'2rem', maxWidth:700, margin:'auto', fontFamily:'sans-serif'}}>
      <h2 style={{textAlign:'center', marginBottom:20}}>จองรถ / Booking</h2>

      {/* Car Info Card */}
      {preCar && (
        <div style={{
          display:'flex', gap:16, alignItems:'center',
          background:'#fff', padding:16, borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', marginBottom:24
        }}>
          <img src={preCar.image} alt={preCar.name} style={{width:120, height:80, objectFit:'cover', borderRadius:8}}/>
          <div>
            <div style={{fontWeight:700, fontSize:16}}>{preCar.name}</div>
            <div style={{fontSize:13, color:'#6b7280'}}>ราคา: {preCar.price.toLocaleString()} ฿/วัน • ปี {preCar.year}</div>
          </div>
        </div>
      )}

      {/* Booking Form Card */}
      <form onSubmit={handleSubmit} style={{background:'#fff', padding:20, borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)'}}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', fontWeight:600, marginBottom:4}}>ชื่อรถ / Car</label>
          <input name="car" value={form.car} onChange={handleChange} required
            style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #cbd5e1'}}/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', fontWeight:600, marginBottom:4}}>วันที่จอง / Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required
            style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #cbd5e1'}}/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', fontWeight:600, marginBottom:4}}>ชื่อผู้จอง / Name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #cbd5e1'}}/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', fontWeight:600, marginBottom:4}}>เบอร์โทร / Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required
            style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #cbd5e1'}}/>
        </div>

        <label style={{display:'flex', alignItems:'center', gap:8, marginBottom:16}}>
          <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} />
          ฉันยอมรับข้อกำหนดและเงื่อนไข
        </label>

        <button type="submit"
          style={{
            width:'100%',
            padding:14,
            background: acceptTerms ? 'linear-gradient(90deg,#06b6d4,#4f46e5)' : '#cbd5e1',
            color:'#fff',
            fontWeight:600,
            border:'none',
            borderRadius:10,
            cursor: acceptTerms ? 'pointer' : 'not-allowed'
          }}>
          จองรถ / Book Now
        </button>
      </form>

      {/* Existing Bookings */}
      <div style={{marginTop:32}}>
        <h3>รายการจองของคุณ (จำลอง)</h3>
        <BookingList />
      </div>
    </div>
  );
};

const BookingList = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    try { setList(JSON.parse(localStorage.getItem('bookings')||'[]')); }
    catch(e){ setList([]) }
  }, []);

  if(!list.length) return <div style={{color:'#6b7280', marginTop:12}}>ยังไม่มีการจอง</div>;

  return (
    <div style={{display:'grid', gap:12, marginTop:12}}>
      {list.map((b,i) => (
        <div key={i} style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 8px 20px rgba(0,0,0,0.06)'}}>
          <div style={{fontWeight:700}}>{b.car || 'รถไม่ทราบชื่อ'}</div>
          <div style={{fontSize:13, color:'#6b7280'}}>
            วันที่: {b.date} • ผู้จอง: {b.name} • โทร: {b.phone}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Booking;
