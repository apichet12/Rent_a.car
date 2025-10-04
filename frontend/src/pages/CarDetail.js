import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carsData from '../data/cars';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = useMemo(() => carsData.find(c => String(c.id) === String(id)), [id]);
  if (!car) return <div style={{ padding: 24 }}>รถไม่พบ (Car not found)</div>;

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
            <button onClick={() => navigate('/booking', { state: { car } })} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#06b6d4,#4f46e5)', color: '#fff', fontWeight: 800 }}>
              จองรถ
            </button>
            <button onClick={() => navigate('/carlist')} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e9f2', background: '#fff', color: '#374151', marginTop: 8 }}>
              กลับไปยังรายการ
            </button>
          </div>
          <div style={{ marginTop: 16, color: '#6b7280' }}>หมายเหตุ: สถานะการว่างเป็นการจำลองในฝั่งไคลเอนต์</div>
        </aside>
      </div>

      {/* Responsive สำหรับมือถือ */}
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
