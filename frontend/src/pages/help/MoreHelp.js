import React from 'react';
import { Link } from 'react-router-dom';

export default function MoreHelp(){
  return (
    <div style={{ maxWidth:1100, margin:'32px auto', padding:'0 18px', fontFamily:'Segoe UI, sans-serif' }}>
      <nav style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
        <Link to="/" style={{ color:'#6b7280', textDecoration:'none' }}>หน้าแรก</Link> &nbsp;›&nbsp; <Link to="/help" style={{ color:'#6b7280', textDecoration:'none' }}>ความช่วยเหลือ</Link> &nbsp;›&nbsp; <strong>ความช่วยเหลือเพิ่มเติม</strong>
      </nav>

      <h1 style={{ fontSize:28, marginBottom:8 }}>ความช่วยเหลือเพิ่มเติม</h1>
      <p style={{ color:'#475569', marginBottom:18 }}>รวมลิงก์และคำแนะนำเพิ่มเติมที่เป็นประโยชน์</p>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>การยกเลิกและคืนเงิน</h2>
        <p style={{ color:'#6b7280' }}>นโยบายการยกเลิกขึ้นอยู่กับผู้ให้บริการแต่ละราย โดยปกติจะมีช่วงเวลายกเลิกฟรีภายใน 24 ชั่วโมงก่อนรับรถ</p>
      </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>การติดต่อฉุกเฉิน</h2>
        <p style={{ color:'#6b7280' }}>เบอร์ติดต่อฉุกเฉิน: 02-038-5222 (ฝ่ายลูกค้าสัมพันธ์)</p>
      </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>ข้อกำหนดและเงื่อนไข</h2>
        <p style={{ color:'#6b7280' }}>อ่านเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัวก่อนใช้บริการ</p>
      </section>
    </div>
  )
}
