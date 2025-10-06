// Booking.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-red-500">❌ ไม่พบข้อมูลรถ</h2>
        <p className="text-gray-600 mb-8 text-center">
          กรุณาเลือกยานพาหนะจากหน้าหลัก
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          ⬅️ กลับไปเลือกรถ
        </button>
      </div>
    );

  const handleBooking = async () => {
    if (!name || !phone || !date) {
      setMessage('⚠️ กรุณากรอกข้อมูล *ชื่อ, *เบอร์โทรศัพท์ และ *วันที่ ให้ครบถ้วน');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call
      /*       const res = await fetch(`${API_URL}/book/${car.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, date }),
      });

      const data = await res.json();
      */
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for loading effect

      const success = true; // Assume success for this example
      if (success) { // Replaced res.ok 
        const stored = JSON.parse(localStorage.getItem('cars_availability') || '{}');
        stored[car.id] = false;
        localStorage.setItem('cars_availability', JSON.stringify(stored));

        setMessage('🎉 การจองสำเร็จ! ขอบคุณที่ใช้บริการค่ะ/ครับ');
        setTimeout(() => navigate('/'), 2000);
      } else {
        // setMessage(data.error || 'เกิดข้อผิดพลาดในการจอง');
        setMessage('❌ รถคันนี้ไม่ว่างในวันที่เลือก');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 max-w-xl w-full mt-8 mb-12 animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          📝 ยืนยันการจองรถ
        </h2>

        {/* Car Info Card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8 transform hover:scale-[1.01] transition duration-300">
          <div className="relative">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-48 object-cover rounded-lg shadow-md mb-4 border-2 border-white"
            />
            {/* Price Badge */}
            <p className="absolute top-3 right-3 bg-red-500 text-white text-lg font-bold px-4 py-1 rounded-full shadow-lg">
              {car.price.toLocaleString()} ฿/วัน
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-2 text-indigo-800">{car.name}</h3>
          <p className="text-indigo-600 text-sm mb-3">{car.desc}</p>
          
          {/* Specs */}
          <div className="flex justify-between text-sm text-indigo-700 bg-indigo-100 p-3 rounded-lg font-medium">
            <span>📅 ปี {car.year || '-'}</span>
            <span>👥 {car.seats} ที่นั่ง</span>
            <span>⛽ {car.fuel}</span>
          </div>
          
          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {car.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-medium shadow-sm"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-2">
            ข้อมูลผู้เช่า
          </h3>
          
          {/* Input: Name */}
          <div className="relative">
            <input
              placeholder="ชื่อ-นามสกุล*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition duration-300"
            />
            <label className="input-label">👤</label>
          </div>

          {/* Input: Phone */}
          <div className="relative">
            <input
              type="tel"
              placeholder="เบอร์โทรศัพท์*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition duration-300"
            />
            <label className="input-label">📞</label>
          </div>

          {/* Input: Date */}
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Set minimum date to today
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition duration-300"
            />
            <label className="input-label">🗓️</label>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className={`w-full p-4 rounded-xl text-white font-bold text-lg shadow-xl mt-4 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-indigo-700 hover:from-teal-600 hover:to-indigo-800 transform hover:scale-[1.01]'} 
              transition duration-300 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังดำเนินการ...
              </>
            ) : (
              'ยืนยันการจอง / Confirm Booking'
            )}
          </button>

          {message && (
            <p
              className={`text-center p-3 rounded-lg font-bold text-sm sm:text-base transition duration-500 animate-slide-in 
                ${
                  message.includes('สำเร็จ') 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
            >
              {message}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full p-3 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition duration-300"
        >
          ⬅️ ยกเลิกและกลับไปหน้าหลัก
        </button>
      </div>
      
      {/* Custom CSS for animation and input icons (outside of Tailwind config) */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .relative .input-label {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            font-size: 1.25rem;
            pointer-events: none; /* Allows click through to input */
        }
        
        .relative input {
            padding-left: 50px; /* Space for the icon/label */
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Booking;