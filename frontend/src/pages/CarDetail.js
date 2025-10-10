import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carsData from '../data/cars';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`https://rentacar-0kj9.onrender.com/cars/${id}`);
        if (!res.ok) throw new Error('รถไม่พบ (Car not found)');
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.warn('Backend ไม่ตอบสนอง, ใช้ mock data แทน');
        const fallbackCar = carsData.find(c => String(c.id) === String(id));
        if (fallbackCar) {
          setCar({ ...fallbackCar, available: Math.random() > 0.3 }); // 
        } else {
          setError('รถไม่พบ');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
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
