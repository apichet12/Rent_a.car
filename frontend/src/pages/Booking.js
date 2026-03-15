import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.css'; // ✅ เพิ่ม CSS ภายนอก

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

  // สถานะการจ่ายเงินด้วยบัตรเครดิต
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

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
  const handlePaymentChange = e => setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!acceptTerms) return alert('กรุณายอมรับข้อกำหนดก่อนดำเนินการ');
    if (!form.pickupDate || !form.dropoffDate || durationDays <= 0)
      return alert('กรุณาเลือกช่วงวันรับและวันคืนรถให้ถูกต้อง');

    const bookingData = {
      ...form,
      carId: preCar?.id || null,
      duration: `${form.pickupDate} ถึง ${form.dropoffDate} (${durationDays} วัน)`,
      total: totalPrice,
      createdAt: new Date().toISOString()
    };
    delete bookingData.pickupDate;
    delete bookingData.dropoffDate;

    // เก็บข้อมูลไว้ก่อน แล้วไปหน้าจ่ายบัตรเครดิต
    setPendingBooking(bookingData);
    setShowPayment(true);
  };

  const completeBooking = () => {
    if (!pendingBooking) return;

    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingToSave = {
        ...pendingBooking,
        payment: {
          method: 'บัตรเครดิต',
          cardLast4: paymentInfo.cardNumber.slice(-4)
        }
      };

      bookings.push(bookingToSave);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      if (preCar?.id) {
        const map = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        map[preCar.id] = false;
        localStorage.setItem('cars_availability', JSON.stringify(map));
      }

      alert('✅ ชำระเงินเรียบร้อยและจองรถสำเร็จ!');
      navigate('/carlist');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handlePaymentSubmit = e => {
    e.preventDefault();
    if (isProcessing) return;

    if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvc) {
      return alert('กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน');
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPayment(false);
      completeBooking();
    }, 1400);
  };

  return (
    <div className="booking-page">
      <h2 className="booking-title">📝 ดำเนินการจองรถ</h2>

      <div className="booking-layout">
        {/* ฟอร์มฝั่งซ้าย */}
        <form className="booking-form" onSubmit={handleSubmit}>
          <h3 className="section-title">ช่วงเวลาเช่า 🗓️</h3>

          <div className="date-group">
            <div className="date-item">
              <label>วันรับรถ</label>
              <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} />
            </div>
            <div className="date-item">
              <label>วันคืนรถ</label>
              <input type="date" name="dropoffDate" value={form.dropoffDate} onChange={handleChange} />
            </div>
          </div>

          <div className="duration-text">
            {durationDays > 0 ? `👉 ระยะเวลาเช่าทั้งหมด: ${durationDays} วัน` : 'กรุณาเลือกวันรับและวันคืนรถ'}
          </div>

          <h3 className="section-title">ข้อมูลผู้ติดต่อ 📞</h3>

          <div className="form-grid">
            <div className="form-group full">
              <label>ชื่อผู้จอง</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="สมชาย ใจดี" required />
            </div>
            <div className="form-group">
              <label>เบอร์โทร</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXXXXXX" required />
            </div>
            <div className="form-group">
              <label>ชื่อรถ</label>
              <input type="text" name="car" value={form.car} disabled={!!preCar} onChange={handleChange} />
            </div>
          </div>

          <label className="terms">
            <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
            ฉันยอมรับข้อกำหนดและเงื่อนไข
          </label>

          <button
            type="submit"
            className={`submit-btn ${acceptTerms ? '' : 'disabled'}`}
            disabled={!acceptTerms || showPayment}
          >
            {showPayment ? 'กำลังรอการชำระเงิน...' : '💸 ยืนยันการจองและชำระเงิน'}
          </button>
        </form>

        {/* Summary ด้านขวา */}
        {preCar && (
          <div className="summary-card">
            <img src={preCar.image} alt={preCar.name} />
            <h4>{preCar.name}</h4>
            <p>ราคา: {preCar.price.toLocaleString()} ฿ / วัน</p>
            {durationDays > 0 && (
              <>
                <hr />
                <p>จำนวนวัน: {durationDays} วัน</p>
                <strong>ราคารวม: {totalPrice.toLocaleString()} ฿</strong>
              </>
            )}
          </div>
        )}
      </div>

      {showPayment && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <h3>💳 ชำระเงินด้วยบัตรเครดิต</h3>
            <p>ยอดชำระ: <strong>{totalPrice.toLocaleString()} ฿</strong></p>

            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <div className="payment-row">
                <label>ชื่อบนบัตร</label>
                <input
                  name="cardName"
                  value={paymentInfo.cardName}
                  onChange={handlePaymentChange}
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </div>
              <div className="payment-row">
                <label>หมายเลขบัตร</label>
                <input
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="payment-row payment-grid">
                <div>
                  <label>วันหมดอายุ (MM/YY)</label>
                  <input
                    name="expiry"
                    value={paymentInfo.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label>CVC</label>
                  <input
                    name="cvc"
                    value={paymentInfo.cvc}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="payment-actions">
                <button type="button" className="payment-cancel" onClick={() => setShowPayment(false)} disabled={isProcessing}>
                  ยกเลิก
                </button>
                <button type="submit" className="payment-confirm" disabled={isProcessing}>
                  {isProcessing ? 'กำลังชำระเงิน...' : 'ชำระเงินและยืนยัน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
