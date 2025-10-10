import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ACCENT_COLOR = '#007BFF';
const ACCENT_LIGHT = '#EBF5FF';
const LIGHT_BG = '#F7F9FC';
const CARD_BG = '#FFFFFF';
const TEXT_COLOR = '#1A202C';
const SUB_TEXT_COLOR = '#718096';
const RED_COLOR = '#E53E3E';
const BORDER_COLOR = '#E2E8F0';
const SHADOW_STYLE = '0 10px 40px rgba(0,0,0,0.1)';

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const preCar = state?.car || null;

  const [form, setForm] = useState({
    car: preCar ? preCar.name : '',
    pickupDate: '',
    dropoffDate: '',
    name: '',
    phone: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    if (!acceptTerms) return alert('กรุณายอมรับข้อกำหนดก่อนดำเนินการ');
    if (!form.pickupDate || !form.dropoffDate || durationDays <= 0)
      return alert('กรุณาเลือกช่วงวันรับและวันคืนรถให้ถูกต้อง');

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
      navigate('/carlist');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="booking-container" style={{ padding: '2rem', background: LIGHT_BG, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: TEXT_COLOR, marginBottom: '2rem' }}>
        📝 ดำเนินการจองรถ
      </h2>

      <div className="booking-main" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="booking-left" style={{ flex: 1, minWidth: '300px', maxWidth: '65%' }}>
          <form className="booking-form" onSubmit={handleSubmit} style={{ background: CARD_BG, padding: '2rem', borderRadius: 20, boxShadow: SHADOW_STYLE, border: `1px solid ${BORDER_COLOR}` }}>
            <SectionTitle text="ช่วงเวลาเช่า 🗓️" />

            <div className="booking-dates" style={{ display: 'flex', gap: '1rem', border: `2px solid ${ACCENT_COLOR}70`, borderRadius: 15, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,123,255,0.2)' }}>
              <DateRangeField
                label="วันรับรถ (Check In)"
                name="pickupDate"
                value={form.pickupDate}
                onChange={handleChange}
                ACCENT_COLOR={ACCENT_COLOR}
                LIGHT_BG={LIGHT_BG}
                isStart
              />
              <DateRangeField
                label="วันคืนรถ (Check Out)"
                name="dropoffDate"
                value={form.dropoffDate}
                onChange={handleChange}
                ACCENT_COLOR={ACCENT_COLOR}
                LIGHT_BG={LIGHT_BG}
              />
            </div>

            <div style={{ textAlign: 'center', margin: '1rem 0 2rem 0', fontWeight: 600, color: durationDays > 0 ? TEXT_COLOR : RED_COLOR }}>
              {durationDays > 0
                ? `👉 ระยะเวลาเช่าทั้งหมด: ${durationDays} วัน`
                : 'กรุณาเลือกวันรับและวันคืนรถ'}
            </div>

            <SectionTitle text="ข้อมูลผู้ติดต่อ 📞" />

            <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField
                label="ชื่อผู้จอง (Full Name)"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="เช่น สมชาย ใจดี"
                TEXT_COLOR={TEXT_COLOR}
                ACCENT_COLOR={ACCENT_COLOR}
                required
                gridSpan={2}
              />
              <InputField
                label="เบอร์โทร (Phone Number)"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08X-XXXXXXX"
                TEXT_COLOR={TEXT_COLOR}
                ACCENT_COLOR={ACCENT_COLOR}
                required
              />
              <InputField
                label="ชื่อรถ (Car Name)"
                name="car"
                value={form.car}
                onChange={handleChange}
                disabled={!!preCar}
                TEXT_COLOR={TEXT_COLOR}
                ACCENT_COLOR={ACCENT_COLOR}
                required
              />
            </div>

            <div style={{ marginTop: '2rem', borderTop: `1px solid ${BORDER_COLOR}`, paddingTop: '1rem' }}>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 14, color: SUB_TEXT_COLOR }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: ACCENT_COLOR }}
                />
                ฉันยืนยันว่าข้อมูลถูกต้องและยอมรับ **ข้อกำหนดและเงื่อนไข** การเช่ารถ
              </label>

              <button
                type="submit"
                disabled={!acceptTerms}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '1rem',
                  background: acceptTerms ? `linear-gradient(90deg, ${ACCENT_COLOR}, #0056b3)` : '#D1D5DB',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: acceptTerms ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s'
                }}
              >
                💸 ยืนยันการจองและชำระเงิน-Confirm booking and payment
              </button>
            </div>
          </form>
        </div>

        <div className="booking-summary" style={{ flex: 1, minWidth: '250px', maxWidth: '35%', position: 'sticky', top: '2rem', alignSelf: 'flex-start' }}>
          <SummaryCard preCar={preCar} durationDays={durationDays} totalPrice={totalPrice} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <BookingList />
      </div>
    </div>
  );
};

// --- Components ---
const SectionTitle = ({ number, text }) => (
  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', borderBottom: `2px solid ${ACCENT_COLOR}30`, paddingBottom: '0.5rem', color: TEXT_COLOR }}>
    {number} {text}
  </h3>
);

const DateRangeField = ({ label, name, value, onChange, ACCENT_COLOR, LIGHT_BG, isStart }) => {
  const formattedDate = value ? new Date(value).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'เลือกวันที่';
  return (
    <div
      style={{
        flex: 1,
        padding: '1rem',
        cursor: 'pointer',
        position: 'relative',
        borderRight: isStart ? `1px solid ${BORDER_COLOR}` : 'none',
        background: CARD_BG,
        transition: 'background 0.2s'
      }}
      onMouseEnter={e => (e.currentTarget.style.background = LIGHT_BG)}
      onMouseLeave={e => (e.currentTarget.style.background = CARD_BG)}
      onClick={() => document.querySelector(`input[name=${name}]`).showPicker()}
    >
      <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: 'block', color: SUB_TEXT_COLOR }}>{label}</label>
      <div style={{ fontWeight: 700, fontSize: 16, borderBottom: value ? `2px solid ${ACCENT_COLOR}` : 'none' }}>{formattedDate}</div>
      <input type="date" name={name} value={value} onChange={onChange} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%' }} />
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, disabled = false, TEXT_COLOR, ACCENT_COLOR, required, fullWidth, gridSpan }) => (
  <div className="form-group" style={{ marginBottom: '1rem', gridColumn: gridSpan ? `span ${gridSpan}` : 'auto' }}>
    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: TEXT_COLOR, fontSize: 14 }}>
      {label} {required && <span style={{ color: RED_COLOR }}>*</span>}
    </label>
    <input
      className="nice-input"
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{ background: disabled ? LIGHT_BG : CARD_BG, color: disabled ? SUB_TEXT_COLOR : TEXT_COLOR }}
    />
  </div>
);

// Component for Booking Summary (Professional Design)
const SummaryCard = ({ preCar, durationDays, totalPrice }) => {
  if (!preCar) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        padding: 32,
        borderRadius: 18,
        border: `1px solid ${BORDER_COLOR}`,
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
      }}
    >
      <h4
        style={{
          color: TEXT_COLOR,
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: 24,
          borderBottom: `2px solid ${ACCENT_COLOR}`,
          paddingBottom: 8,
        }}
      >
        รายละเอียดการจอง
      </h4>

      {/* Car Section */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            flex: '0 0 110px',
            height: 75,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
          }}
        >
          <img
            src={preCar.image}
            alt={preCar.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: TEXT_COLOR }}>
            {preCar.name}
          </div>
          <div style={{ fontSize: 14, color: SUB_TEXT_COLOR, marginTop: 4 }}>
            ราคาต่อวัน: <span style={{ color: ACCENT_COLOR }}>{preCar.price.toLocaleString()} ฿</span>
          </div>
          <div style={{ fontSize: 13, color: SUB_TEXT_COLOR, marginTop: 2 }}>
            ประเภท: {preCar.type || 'ไม่ระบุ'} • ระบบ: {preCar.fuel || 'ไม่ระบุ'}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: BORDER_COLOR,
          margin: '20px 0',
        }}
      ></div>

      {/* Booking Summary Info */}
      <div style={{ display: 'grid', gap: 10, fontSize: 15, color: TEXT_COLOR }}>
        <SummaryRow label="จำนวนวันเช่า:" value={durationDays > 0 ? `${durationDays} วัน` : '-'} highlight={durationDays > 0} />
        <SummaryRow label="ราคารวม (ไม่รวมภาษี):" value={`${totalPrice.toLocaleString()} ฿`} />
      </div>

      {/* Total */}
      <div
        style={{
          marginTop: 25,
          paddingTop: 15,
          borderTop: `2px solid ${ACCENT_COLOR}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 17, color: TEXT_COLOR }}>ยอดชำระรวม</span>
        <span
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: ACCENT_COLOR,
          }}
        >
          {totalPrice.toLocaleString()} ฿
        </span>
      </div>

      {/* Note */}
      <div
        style={{
          fontSize: 12,
          color: SUB_TEXT_COLOR,
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        *ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่มและค่าประกันภัย
      </div>
    </div>
  );
};

// Subcomponent: SummaryRow
const SummaryRow = ({ label, value, highlight = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span style={{ color: SUB_TEXT_COLOR }}>{label}</span>
    <span
      style={{
        fontWeight: 600,
        color: highlight ? ACCENT_COLOR : TEXT_COLOR,
      }}
    >
      {value}
    </span>
  </div>
);


const BookingList = () => {
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
      <div style={{ textAlign: 'center', padding: 20, background: LIGHT_BG, borderRadius: 10, border: `1px dashed ${BORDER_COLOR}`, color: SUB_TEXT_COLOR }}>
         ยังไม่มีการจองเกิดขึ้นในขณะนี้
      </div>
    );

  return (
    <div style={{ display: 'grid', gap: 10, maxHeight: 300, overflowY: 'auto', marginTop: '1rem' }}>
      {list.map((b, i) => (
        <div key={i} style={{ padding: 10, borderRadius: 10, background: ACCENT_LIGHT + '70', borderLeft: `5px solid ${ACCENT_COLOR}` }}>
          <div style={{ fontWeight: 700, color: ACCENT_COLOR }}>{b.car || 'รถไม่ทราบชื่อ'}</div>
          <div style={{ fontSize: 13, color: SUB_TEXT_COLOR }}>
            🗓️ {b.duration} | 👤 {b.name} | 📞 {b.phone}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Booking;
