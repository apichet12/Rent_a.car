import React from 'react';
import { Link } from 'react-router-dom';

const CarsBrowse = () => {
  const cars = [
    { id: 1, name: 'Honda Civic', price: 1200, img: '/images/honda.jpg' },
    { id: 2, name: 'Toyota Yaris', price: 900, img: '/images/toyota.jpg' },
    { id: 3, name: 'Mazda 3', price: 1100, img: '/images/2ee5f421-8d2b.jpg' }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Cars</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
        {cars.map(c => (
          <div key={c.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 18px rgba(2,6,23,0.04)' }}>
            <div style={{ height: 140, backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ color: '#6b7280', marginTop: 6 }}>{c.price} ฿ / day</div>
              <div style={{ marginTop: 10 }}>
                <Link to="/cardetail" className="btn-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsBrowse;
