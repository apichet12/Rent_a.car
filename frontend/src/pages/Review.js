import React, { useState } from 'react';

const Review = () => {
  const [reviews, setReviews] = useState([
    { name: 'สมชาย', comment: 'รถใหม่ สะอาดมาก!', rating: 5 },
    { name: 'John', comment: 'บริการดีมาก', rating: 4 },
    { name: 'Jane', comment: 'จองง่าย สะดวกมาก', rating: 5 },
    { name: 'ปิ่น', comment: 'พนักงานสุภาพ', rating: 5 },
    { name: 'Alex', comment: 'รถหลากหลายดี', rating: 4 },
    { name: 'นัท', comment: 'ราคาดี มีโปรฯ', rating: 5 },
    { name: 'Somsri', comment: 'ชอบระบบจองออนไลน์', rating: 5 },
    { name: 'Mike', comment: 'แนะนำเพื่อนต่อแน่นอน', rating: 5 },
  ]);

  const [form, setForm] = useState({ name: '', comment: '', rating: 5 });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setReviews([...reviews, { ...form, rating: Number(form.rating) }]);
    setForm({ name: '', comment: '', rating: 5 });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
        รีวิวลูกค้า / Customer Reviews
      </h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <input
          name="name" placeholder="ชื่อ / Name" value={form.name} onChange={handleChange} required
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '100%' }}
        />
        <textarea
          name="comment" placeholder="รีวิว / Review" value={form.comment} onChange={handleChange} required
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>คะแนน: </span>
          {[1, 2, 3, 4, 5].map(star => (
            <label key={star} style={{ cursor: 'pointer' }}>
              <input type="radio" name="rating" value={star} checked={form.rating === star} onChange={handleChange} style={{ display: 'none' }} />
              <span style={{ color: star <= form.rating ? '#fbbf24' : '#ddd', fontSize: '1.5rem' }}>★</span>
            </label>
          ))}
        </div>
        <button type="submit" style={{
          width: '100%', padding: '14px', background: 'linear-gradient(90deg,#06b6d4,#4f46e5)',
          color: '#fff', fontWeight: 600, border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.3s'
        }}>ส่งรีวิว</button>
      </form>

      {/* Reviews Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        gap: '1.5rem'
      }}>
        {reviews.map((r, idx) => (
          <div key={idx} style={{
            background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px'
          }}>
            <div>
              <strong style={{ color: '#4f46e5', fontSize: '1.2rem' }}>{r.name}</strong>
              <div style={{ margin: '6px 0' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '1.3rem' }}>★</span>
                ))}
              </div>
              <p style={{ color: '#334155', marginTop: '6px' }}>{r.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>
        {`
          @media (max-width: 768px) {
            form { padding: 1.5rem; }
            input, textarea { padding: 10px; }
            button { padding: 12px; }
          }
          @media (max-width: 480px) {
            form { padding: 1rem; }
            input, textarea { padding: 8px; }
            button { padding: 10px; font-size: 0.9rem; }
          }
        `}
      </style>
    </div>
  );
};

export default Review;
