import React from 'react';
import { Link } from 'react-router-dom';

export default function DocsHelp(){
  return (
    <div style={{ maxWidth:1100, margin:'32px auto', padding:'0 18px', fontFamily:'Segoe UI, sans-serif' }}>
      <nav style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
        <Link to="/" style={{ color:'#6b7280', textDecoration:'none' }}>หน้าแรก</Link> &nbsp;›&nbsp; <Link to="/help" style={{ color:'#6b7280', textDecoration:'none' }}>ความช่วยเหลือ</Link> &nbsp;›&nbsp; <strong>เอกสารการเช่ารถ</strong>
      </nav>

      <h1 style={{ fontSize:28, marginBottom:8 }}>เอกสารการเช่ารถ</h1>
      <p style={{ color:'#475569', marginBottom:18 }}>เอกสารที่ต้องเตรียมเพื่อการเช่ารถที่ราบรื่น</p>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>เอกสารสำหรับผู้เช่าชาวไทย</h2>
        <ul style={{ color:'#6b7280' }}>
          <li>บัตรประชาชนตัวจริง (สำเนาไม่ได้)</li>
          <li>ใบขับขี่ที่ยังไม่หมดอายุ (ประเภทที่เหมาะสมกับรถที่เช่า)</li>
          <li>บัตรเครดิตสำหรับวางมัดจำ (กรณีต้องการความคุ้มครองเพิ่มเติม)</li>
        </ul>
      </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>เอกสารสำหรับชาวต่างชาติ</h2>
        <ul style={{ color:'#6b7280' }}>
          <li>Passport (ตัวจริง)</li>
          <li>ใบอนุญาตขับขี่ระหว่างประเทศหรือใบขับขี่ท้องถิ่นที่ยอมรับได้</li>
          <li>เอกสารแสดงการพำนักหรือวีซ่าที่ยังไม่หมดอายุ</li>
        </ul>
      </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>หมายเหตุ</h2>
        <p style={{ color:'#6b7280' }}>บริษัทอาจขอเอกสารเพิ่มเติมตามนโยบายของผู้ให้บริการรถเช่าแต่ละราย</p>
      </section>
    </div>
  )
}
