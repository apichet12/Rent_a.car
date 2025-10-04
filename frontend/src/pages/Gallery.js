import React from 'react';

const images = [
  'https://images.unsplash.com/photo-1511918984145-48de785d4c4e',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946a',
  'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023',
];

const Gallery = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>
        แกลเลอรี่รถ / Car Gallery
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(79,70,229,0.12)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(79,70,229,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.12)';
            }}
          >
            <img
              src={img}
              alt={`car${idx}`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Car {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
