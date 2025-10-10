import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carsData from '../data/cars';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        // try backend first (relative path)
        const res = await fetch(`/api/cars/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCar({ ...data, features: data.features || [] });
        } else {
          throw new Error('รถไม่พบจาก backend');
        }
      } catch (err) {
        console.warn('Backend ไม่ตอบสนองหรือไม่พบรถ, ใช้ mock data แทน', err && err.message);
        const fallbackCar = carsData.find(c => String(c.id) === String(id));
        if (fallbackCar) {
          setCar({ ...fallbackCar, available: Math.random() > 0.3, features: fallbackCar.features || [] });
        } else {
          setError('รถไม่พบ');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews`);
        if (!res.ok) return;
        const data = await res.json();
        setReviews(data.filter(r => String(r.carId || '') === String(id) || !r.carId).slice(0,5));
      } catch (e) { /* ignore */ }
    };
    fetchReviews();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;
  if (!car) return <div style={{ padding: 24 }}>รถไม่พบ</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }} className="car-grid">
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 32px rgba(2,6,23,0.06)' }}>
          <img src={car.image} alt={car.name} style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 12 }} />
          <h1 style={{ marginTop: 12, color: '#111827' }}>{car.name}</h1>
          <p style={{ color: '#374151' }}>{car.desc}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>ปี: {car.year}</div>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>ที่นั่ง: {car.seats}</div>
            <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>เชื้อเพลิง: {car.fuel}</div>
          </div>

          <h3 style={{ marginTop: 16 }}>คุณสมบัติ</h3>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 8, listStyle: 'none', padding: 0 }}>
            {car.features.map((f, i) => (
              <li key={i} style={{ background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 4px 16px rgba(2,6,23,0.03)' }}>
                • {f}
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: 16 }}>รีวิวจากลูกค้า</h3>
          {reviews.length === 0 ? (
            <div style={{ color: '#6b7280' }}>ยังไม่มีรีวิวสำหรับรถคันนี้</div>
          ) : (
            <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#fff', padding: 10, borderRadius: 8, boxShadow: '0 4px 16px rgba(2,6,23,0.03)' }}>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString('th-TH')}</div>
                  <div style={{ marginTop: 8 }}>{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 32px rgba(2,6,23,0.06)' }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>ราคา/วัน</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#06b6d4' }}>{car.price.toLocaleString()} ฿</div>
          <div style={{ marginTop: 12 }}>
            <button
              disabled={!car.available}
              onClick={() => navigate('/booking', { state: { car } })}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: car.available ? 'linear-gradient(90deg,#06b6d4,#4f46e5)' : '#ddd', color: car.available ? '#fff' : '#888', fontWeight: 800 }}
            >
              {car.available ? 'จองรถ' : 'ไม่ว่าง'}
            </button>
            <button onClick={() => navigate('/carlist')} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e9f2', background: '#fff', color: '#374151', marginTop: 8 }}>
              กลับไปยังรายการ
            </button>
          </div>
          <div style={{ marginTop: 16, color: '#6b7280' }}>หมายเหตุ: สถานะการว่างมาจาก backend หรือ mock data</div>
        </aside>
      </div>

      {/* สำหรับมือถือ */}
      <style>
        {`
          @media (max-width: 768px) {
            .car-grid {
              grid-template-columns: 1fr !important;
            }
            .car-grid > div:first-child img {
              height: 280px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CarDetail;
