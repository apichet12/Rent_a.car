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

  if (!car)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">ไม่พบข้อมูลรถ</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gradient-to-r from-teal-400 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          กลับไปหน้ารถ
        </button>
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, date }),
      });

      const data = await res.json();
      if (res.ok) {
        const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        stored[car.id] = false;
        localStorage.setItem('cars_availability', JSON.stringify(stored));

        setMessage('🎉 จองรถสำเร็จ!');
        setTimeout(() => navigate('/'), 2000);
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
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-lg w-full mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">จองรถ / Booking</h2>

        {/* Car Card */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-60 object-cover rounded-xl shadow-md mb-4"
          />
          <h3 className="text-xl font-semibold">{car.name}</h3>
          <div className="text-gray-500 mb-2">
            ปี {car.year || '-'} | {car.seats} ที่นั่ง | {car.fuel}
          </div>
          <p className="text-lg font-medium text-indigo-700">
            ราคา/วัน: {car.price.toLocaleString()} บาท
          </p>
        </div>

        {/* Booking Form */}
        <div className="flex flex-col gap-4">
          <input
            placeholder="ชื่อ-นามสกุล"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={handleBooking}
            disabled={loading}
            className="p-3 rounded-xl text-white font-bold bg-gradient-to-r from-teal-400 to-indigo-600 shadow-lg hover:opacity-90 transition"
          >
            {loading ? 'กำลังจอง...' : 'จองรถ'}
          </button>
          {message && <p className="text-center mt-2 text-red-500 font-medium">{message}</p>}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full p-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
        >
          กลับไปหน้ารถ
        </button>
      </div>
    </div>
  );
};

export default Booking;
