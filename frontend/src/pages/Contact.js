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
        <input name="name" placeholder="ชื่อ / Name" value={form.name} onChange={handleChange} required style={{width:'100%',margin:'8px 0',padding:'8px'}} />
        <input name="email" type="email" placeholder="อีเมล / Email" value={form.email} onChange={handleChange} required style={{width:'100%',margin:'8px 0',padding:'8px'}} />
        <textarea name="message" placeholder="ข้อความ / Message" value={form.message} onChange={handleChange} required style={{width:'100%',margin:'8px 0',padding:'8px'}} />
        <button type="submit" style={{width:'100%',padding:'10px',background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',marginTop:'12px'}}>ส่งข้อความ</button>
      </form>
    </div>
  );
};
export default Contact;
