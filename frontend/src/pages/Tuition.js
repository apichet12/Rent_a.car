import React from 'react';
import './Home.css';

const Tuition = () => {
  const services = [
    { title: 'ติวคณิตศาสตร์', desc: 'ติวแบบตัวต่อตัวหรือกลุ่ม ครอบคลุม ม.ต้น-ม.ปลาย และเตรียมสอบ' },
    { title: 'ติวภาษาอังกฤษ', desc: 'ปรับพื้นฐาน พัฒนาทักษะการฟัง พูด อ่าน เขียน และเตรียมสอบ IELTS/TOEFL' },
    { title: 'ติววิทยาศาสตร์', desc: 'ชีวะ เคมี ฟิสิกส์ เน้นการทดลองและการแก้โจทย์เชิงวิเคราะห์' },
    { title: 'ติวสอบเข้า', desc: 'คอร์สเข้มข้นสำหรับการสอบเข้าโรงเรียนชั้นนำและมหาวิทยาลัย' },
    { title: 'เรียนออนไลน์', desc: 'คอร์ส on-demand ดูซ้ำได้ พร้อมเอกสารประกอบการเรียน' }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: 16 }}>
      <h1 style={{ color: '#0b74a6' }}>บริการเรียนพิเศษ</h1>
      <p style={{ color: '#374151' }}>บริการติวคุณภาพจากผู้สอนที่มีประสบการณ์ ทั้งแบบตัวต่อตัวและออนไลน์</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: 18 }}>
        {services.map((s, i) => (
          <div key={i} style={{ background: '#fff', padding: 16, borderRadius: 10, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
            <div style={{ fontWeight: 800, color: '#0b74a6', marginBottom: 8 }}>{s.title}</div>
            <div style={{ color: '#475569' }}>{s.desc}</div>
            <div style={{ marginTop: 12 }}>
              <a href={`/cars?q=${encodeURIComponent(s.title)}`} style={{ color: '#06b6d4', fontWeight: 700 }}>ดูคอร์สและอาจารย์</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tuition;
