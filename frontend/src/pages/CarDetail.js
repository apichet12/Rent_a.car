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
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (res.ok) {
          const data = await res.json();
          const images = data.images && data.images.length ? data.images : [data.image];
          setCar({ ...data, images, features: data.features || [] });
          setMainImage(images[0]);
        } else throw new Error('not found');
      } catch (err) {
        const fallback = carsData.find(c => String(c.id) === String(id));
        if (fallback) {
          const images = fallback.images && fallback.images.length ? fallback.images : [fallback.image];
          setCar({ ...fallback, images, available: Math.random() > 0.3, features: fallback.features || [] });
          setMainImage(images[0]);
        } else setError('รถไม่พบ');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const data = await res.json();
        setReviews(data.filter(r => String(r.carId || '') === String(id) || !r.carId));
      } catch (e) {}
    };
    fetchReviews();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;
  if (!car) return <div style={{ padding: 24 }}>รถไม่พบ</div>;

  // review summary
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 4), 0) / reviews.length) : 4.8;
  const totalReviews = reviews.length || 123;

  // price calc sample (2 days)
  const days = 2;
  const daily = car.price || 0;
  const subtotal = daily * days;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;

  return (
    <div style={{ maxWidth: 1180, margin: '2rem auto', padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }} className="car-grid">
        <main style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 32px rgba(2,6,23,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12 }}>
            <div>
              <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                <img src={mainImage} alt={car.name} style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 10 }}>
                {car.images.map((img, i) => (
                  <button key={i} onClick={() => setMainImage(img)} style={{ border: 'none', padding: 0, background: 'transparent', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={img} alt={`${car.name}-${i}`} style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '6px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/logo192.png" alt="logo" style={{ width: 42, height: 42 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{car.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{car.location || 'บางนา-พระราม 9'}</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ background: '#e6f6ff', color: '#0369a1', padding: '6px 8px', borderRadius: 8, fontWeight: 700 }}>{avgRating.toFixed(1)}</div>
                  <div style={{ color: '#6b7280' }}>{totalReviews} รีวิว</div>
                </div>
              </div>

              <p style={{ color: '#334155', marginTop: 12 }}>{car.desc}</p>

              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>ปี {car.year}</div>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>{car.seats} ที่นั่ง</div>
                  <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}>{car.fuel}</div>
                </div>
              </div>

              <h4 style={{ marginTop: 14 }}>อุปกรณ์ความสะดวก</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {(car.features || []).slice(0,6).map((f, i) => (
                  <li key={i} style={{ background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 4px 16px rgba(2,6,23,0.03)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, background: '#06b6d4', borderRadius: 999 }} />{f}
                  </li>
                ))}
              </ul>

              <h4 style={{ marginTop: 16 }}>รีวิวจากผู้เช่า</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800 }}>{avgRating.toFixed(1)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{totalReviews} คะแนน</div>
                  <div style={{ color: '#6b7280' }}>ความพึงพอใจโดยรวม</div>
                </div>
              </div>

            </div>
          </div>
        </main>

        <aside style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 12px 34px rgba(2,6,23,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#6b7280' }}>ราคา/วัน</div>
            <div style={{ fontWeight: 800, color: '#06b6d4' }}>{daily.toLocaleString()} ฿</div>
          </div>

          <div style={{ marginTop: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>วันรับ</div>
              <div>10/10/2025 21:00</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <div>วันคืน</div>
              <div>12/10/2025 21:00</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>จำนวนวัน</div><div>{days} วัน</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><div>ยอดต่อวัน</div><div>{daily.toLocaleString()} ฿</div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><div>ภาษี</div><div>{tax.toLocaleString()} ฿</div></div>
            <hr style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}><div>รวม</div><div>{total.toLocaleString()} ฿</div></div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button onClick={() => navigate('/booking', { state: { car } })} style={{ width: '100%', padding: 12, background: 'linear-gradient(90deg,#06b6d4,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800 }}>จองเลย</button>
            <button onClick={() => navigate('/cars')} style={{ width: '100%', padding: 10, marginTop: 8, borderRadius: 8, border: '1px solid #e6e9f2', background: '#fff' }}>กลับไปยังรายการ</button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px){
          .car-grid { grid-template-columns: 1fr !important; }
          .car-grid > main img { height: 260px !important; }
        }
      `}</style>
    </div>
  );
};

export default CarDetail;
