import React from 'react';
import { useState } from 'react';
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: ส่งข้อความไป backend
    alert('ส่งข้อความสำเร็จ!');
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <div style={{padding:'2rem',maxWidth:400,margin:'auto'}}>
      <h2>ฟอร์มติดต่อ / Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input className="nice-input" name="name" placeholder="ชื่อ / Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input className="nice-input" name="email" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <textarea className="nice-input" name="message" placeholder="ข้อความ / Message" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'12px'}}>ส่งข้อความ</button>
      </form>
    </div>
  );
};
export default Contact;
