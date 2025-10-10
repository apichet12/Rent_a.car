import React, { useState, useEffect } from 'react';

// Clean Review component — no embedded sample reviews
const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) })
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews(prev => [...prev, saved]);
        setForm({ name: '', comment: '', rating: 5 });
        return;
      }
    } catch (err) {
      console.warn('POST /api/reviews failed, falling back to local state', err);
    }

    setReviews(prev => [...prev, { ...form, rating: Number(form.rating) }]);
    setForm({ name: '', comment: '', rating: 5 });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
        รีวิวลูกค้า / Customer Reviews
      </h2>

      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <input className="nice-input" name="name" placeholder="ชื่อ / Name" value={form.name} onChange={handleChange} required />
        <textarea className="nice-input" name="comment" placeholder="รีวิว / Review" value={form.comment} onChange={handleChange} required style={{ minHeight: '80px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>คะแนน: </span>
          {[1, 2, 3, 4, 5].map(star => (
            <label key={star} style={{ cursor: 'pointer' }}>
              <input type="radio" name="rating" value={star} checked={Number(form.rating) === star} onChange={handleChange} style={{ display: 'none' }} />
              <span style={{ color: star <= form.rating ? '#fbbf24' : '#ddd', fontSize: '1.5rem' }}>★</span>
            </label>
          ))}
        </div>
        <button type="submit" className="btn-primary">ส่งรีวิว</button>
      </form>

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
                {[...Array(Number(r.rating) || 0)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '1.3rem' }}>★</span>
                ))}
              </div>
              <p style={{ color: '#334155', marginTop: '6px' }}>{r.comment}</p>
            </div>
          </div>
        ))}
      </div>

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
