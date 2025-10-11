import React from 'react';
import { Link } from 'react-router-dom';

export default function InsuranceHelp(){
  return (
    <div style={{ maxWidth:1100, margin:'32px auto', padding:'0 18px', fontFamily:'Segoe UI, sans-serif' }}>
      <nav style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
        <Link to="/" style={{ color:'#6b7280', textDecoration:'none' }}>หน้าแรก</Link> &nbsp;›&nbsp; <Link to="/help" style={{ color:'#6b7280', textDecoration:'none' }}>ความช่วยเหลือ</Link> &nbsp;›&nbsp; <strong>ประกันภัย</strong>
      </nav>

      <h1 style={{ fontSize:28, marginBottom:8 }}>ประกันภัย</h1>
      <p style={{ color:'#475569', marginBottom:18 }}>ข้อมูลประกันภัยที่รวมอยู่ในการเช่ารถ และตัวเลือกเสริม</p>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>ประกันภัยพื้นฐาน (รวมในการเช่า)</h2>
        <p style={{ color:'#6b7280' }}>ประกันภัยชั้นพื้นฐานครอบคลุมความเสียหายต่อบุคคลที่สามและความเสียหายบางส่วนต่อรถเช่า ตามข้อกำหนดของผู้ให้บริการ</p>
+      </section>
+
+      <section style={{ marginBottom:20 }}>
+        <h2 style={{ fontSize:20 }}>ประกันภัยเสริม (เลือกเพิ่มได้)</h2>
+        <ul style={{ color:'#6b7280' }}>
+          <li>ความคุ้มครองแบบลดค่าเสียหาย (Collision Damage Waiver - CDW)</li>
+          <li>ประกันภัยบุคคลที่สามเพิ่มเติม</li>
+          <li>คุ้มครองกระจกยางและอุปกรณ์ในรถ</li>
+        </ul>
       </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>ขั้นตอนเมื่อเกิดอุบัติเหตุ</h2>
        <ol style={{ color:'#6b7280' }}>
          <li>ติดต่อฝ่ายบริการลูกค้าของผู้ให้บริการรถเช่า</li>
          <li>บันทึกภาพและรายละเอียดเหตุการณ์</li>
          <li>ส่งเอกสารประกอบและรายงานตามคำแนะนำ</li>
        </ol>
      </section>

      <section style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:20 }}>คำแนะนำเพิ่มเติม</h2>
        <p style={{ color:'#6b7280' }}>อ่านเงื่อนไขประกันภัยในหน้ารายละเอียดรถก่อนยืนยันการจอง</p>
      </section>
    </div>
  )
}
