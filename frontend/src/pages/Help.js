import React from 'react';
import './Help.css';

const questions = [
  'คนไทยต้องใช้เอกสารอะไรบ้างในการจองรถเช่า?',
  'คนต่างชาติต้องใช้เอกสารอะไรบ้างในการจองรถเช่า?',
  'ราคานี้มีประกันภัยรวมอยู่ด้วยหรือไม่?',
  'ค่าเช่าล่วงหน้า หรือค่ามัดจำคืออะไร?',
  'รถเช่ามีการจำกัดระยะทางหรือไม่?',
  'กรณีรับ - ส่งนอกเวลาทำการ มีค่าใช้จ่ายเพิ่มเติมหรือไม่?',
  'สามารถรับ - ส่งรถข้ามจังหวัดได้หรือไม่?'
];

export default function Help() {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ color: '#0b74a6', marginBottom: 12 }}>ให้เราช่วยอะไรคุณได้บ้าง?</h2>
      <div className="help-grid">
        {questions.map((q, i) => (
          <div className="help-card" key={i}>
            <div className="help-card-body">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{q}</div>
              <div style={{ color: '#6b7280' }}>กดเพื่อขยายคำตอบ</div>
            </div>
            <div className="help-card-icon">›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
