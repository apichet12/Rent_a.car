import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import carsData from '../data/cars';

/* ---------------- CERTIFICATE CARD ---------------- */
function CertificateCard({ cert }) {
  const cardRef = useRef();
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 12;
      const rotateX = (0.5 - y / rect.height) * 8;
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };
    const reset = () => (card.style.transform = 'rotateY(0deg) rotateX(0deg)');
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minWidth: 200,
        height: 300,
        textAlign: 'center',
        transition: 'transform 0.2s',
        perspective: 600,
        margin: '0 1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <img
        src={cert.img}
        alt={cert.name}
        style={{
          width: '100%',
          height: 180,
          objectFit: 'cover',
        }}
      />
      <h3 style={{ color: '#4f46e5', margin: '2.2rem 0 0.25rem 0' }}>
        {cert.name}
      </h3>
      <p style={{ color: '#555', fontSize: 14, padding: '0 0.8rem' }}>
        {cert.desc}
      </p>
    </div>
  );
}

/* ---------------- AUTO PLAY VIDEO ---------------- */
const AutoPlayVideo = ({ src, poster }) => {
  const videoRef = useRef();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);
  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      controls
      playsInline
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    />
  );
};

/* ---------------- FEATURED CARS ---------------- */
const FeaturedCars = ({ searchQuery }) => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cars_availability');
      if (stored) {
        const map = JSON.parse(stored);
        setCars(carsData.slice(0, 6).map(c => ({ ...c, available: map[c.id] !== undefined ? map[c.id] : true })));
      } else {
        const initial = carsData.slice(0, 6).map(c => ({ ...c, available: Math.random() > 0.3 }));
        setCars(initial);
        const map = {};
        initial.forEach(x => (map[x.id] = x.available));
        localStorage.setItem('cars_availability', JSON.stringify(map));
      }
    } catch (e) {
      setCars(carsData.slice(0, 6).map(c => ({ ...c, available: Math.random() > 0.3 })));
    }
  }, []);

  const goToBooking = car => { navigate('/booking', { state: { car } }); };

  const filteredCars = cars.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
      {filteredCars.map(car => (
        <div key={car.id}
          style={{ background: '#fff', padding: 12, borderRadius: 12, boxShadow: '0 6px 20px rgba(2,6,23,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform .2s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
          <img src={car.image} alt={car.name} loading="lazy"
            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{car.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>ปี {car.year} • {car.seats} ที่นั่ง</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#06b6d4' }}>{car.price.toLocaleString()} ฿/วัน</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {car.available ? <span style={{ color: '#059669', fontWeight: 700 }}>ว่าง</span> :
                                <span style={{ color: '#ef4444', fontWeight: 700 }}>ไม่ว่าง</span>}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button disabled={!car.available} onClick={() => goToBooking(car)}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: car.available ? 'linear-gradient(90deg,#06b6d4,#4f46e5)' : '#e5e7eb', color: '#fff', fontWeight: 700, cursor: car.available ? 'pointer' : 'not-allowed' }}>
              จอง
            </button>
            <button onClick={() => navigate(`/cars/${car.id}`)}
              style={{ padding: 10, borderRadius: 8, background: '#fff', border: '1px solid #e6e9f2', color: '#374151' }}>
              รายละเอียด
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- HOME ---------------- */
const Home = () => {
  useTranslation();
  const [search, setSearch] = useState('');
  const heroImages = [
    'https://images.unsplash.com/photo-1511918984145-48de785d4c4e',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
    'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8',
  ];

  const certificates = [
    { name: 'ISO 9001', img: '/images/iso9001.png', desc: 'มาตรฐานคุณภาพสากล' },
    { name: 'Thailand Trusted Quality', img: '/images/633db849-5816-477f-8c09-b0bac0df786f.jpg', desc: 'รับรองโดยกระทรวงพาณิชย์' },
    { name: 'Best Car Rental 2024', img: '/images/2ee5f421-8d2b.jpg', desc: 'รางวัลยอดเยี่ยมแห่งปี' },
  ];

  return (
    <div style={{ padding: 0, background: 'linear-gradient(120deg,#f8fafc 60%,#e0e7ff 100%)', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(90deg,#06b6d4,#4f46e5)', color: '#fff', padding: '3rem 2rem', borderRadius: '0 0 28px 28px', boxShadow: '0 12px 48px #3336', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', maxWidth: 1200, margin: 'auto' }}>
          <div style={{ flex: '1 1 100%', maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>ระบบเช่ารถออนไลน์และปลอดภัย</h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, marginTop: '1rem' }}>รถใหม่ สะอาด ปลอดภัย พร้อมบริการครบวงจร</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', justifyContent:'center', flexWrap:'wrap'}}>
              <a href="/cars" style={{ background: '#fff', color: '#06b6d4', padding: '10px 18px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>เลือกรถ</a>
              <a href="/booking" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}>จองรถ</a>
            </div>
          </div>
          <div style={{ flex: '1 1 100%', maxWidth: 420, textAlign:'center', marginTop: '1rem' }}>
            <AutoPlayVideo src="https://www.pexels.com/th-th/download/video/855432/" poster={heroImages[0]} />
          </div>
        </div>
      </section>

      {/* FEATURED CARS + SEARCH */}
      <div style={{ marginTop: 28, gridColumn: '1 / -1' }}>
        <h2 style={{ fontSize: 26, color: '#111827', marginBottom: 12 }}>รถแนะนำ / Featured Cars</h2>
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อรถ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            marginBottom: 20,
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <FeaturedCars searchQuery={search} />
      </div>

      {/* CERTIFICATES + FAQ + FOOTER เหมือนเดิม */}
      <section style={{ maxWidth: 1200, margin: '2rem auto', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0b74a6' }}>ใบรับรองและรางวัล</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {certificates.map((c, i) => <CertificateCard key={i} cert={c} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
