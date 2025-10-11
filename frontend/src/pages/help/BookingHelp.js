import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingHelp() {
  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 18px', fontFamily: 'Segoe UI, sans-serif' }}>
      <nav style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
        <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>หน้าแรก</Link> &nbsp;›&nbsp; <span style={{ color: '#6b7280' }}>ความช่วยเหลือ</span> &nbsp;›&nbsp; <strong>จองรถเช่าขับเองมีขั้นตอนอย่างไร?</strong>
      </nav>

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>จองรถเช่าขับเองมีขั้นตอนอย่างไร?</h1>
      <p style={{ color: '#475569', marginBottom: 18 }}>คำแนะนำทีละขั้นตอนเพื่อช่วยให้คุณจองรถได้อย่างรวดเร็วและถูกต้อง</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20 }}>1. เลือกสถานที่รับ - คืนรถ</h2>
        <p style={{ color: '#6b7280' }}>ระบุสถานที่รับรถและคืนรถที่ต้องการ จากนั้นเลือกเงื่อนไขการรับรถ (สนามบิน หรือ สาขา)</p>
        <img src="/help/step1.png" alt="step1" style={{ width: '100%', maxWidth: 920, borderRadius: 8, marginTop: 12 }} />
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20 }}>2. เลือกวันและเวลาที่ต้องการเช่ารถ</h2>
        <p style={{ color: '#6b7280' }}>เลือกช่วงเวลาที่ต้องการเช่ารถ จากนั้นคลิก "ค้นหารถเช่า" เพื่อดูรายการที่ว่าง</p>
        <img src="/help/step2.png" alt="step2" style={{ width: '100%', maxWidth: 920, borderRadius: 8, marginTop: 12 }} />
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20 }}>3. เลือกรถที่ต้องการ</h2>
        <p style={{ color: '#6b7280' }}>ใช้ฟิลเตอร์เพื่อเลือกรถตามประเภท ราคา หรือความต้องการพิเศษ เช่น ที่นั่ง หรือ กระเป๋า</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20 }}>4. ยืนยันการจองและการชำระเงิน</h2>
        <p style={{ color: '#6b7280' }}>ตรวจสอบรายละเอียดการจอง กรอกข้อมูลผู้เช่า แล้วเลือกวิธีการชำระเงินที่เหมาะสม</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20 }}>ติดต่อเรา</h2>
        <p style={{ color: '#6b7280' }}>หากพบปัญหาในการจอง ติดต่อฝ่ายบริการลูกค้า: 02-038-5222 หรือ Line: @drivehub</p>
      </section>
    </div>
  );
}
