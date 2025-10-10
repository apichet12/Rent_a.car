# Backend (Node.js + Express)

- ใช้ Node.js + Express
- เชื่อมต่อ MySQL
- รองรับ JWT Auth (Admin/User)
- API: จัดการรถ, การจอง, รายงาน, อัปโหลด/ตรวจสอบเอกสาร, แจ้งเตือน
- รองรับ S3 สำหรับไฟล์

## ตัวแปรสภาพแวดล้อมที่จำเป็น

- `DB_HOST` (เช่น 127.0.0.1 หรือ host ที่ผู้ให้บริการฐานข้อมูลให้มา)
- `DB_PORT` (ค่าเริ่มต้น 3306)
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT` (ถ้าไม่ระบุ จะใช้ 5000)

## คำแนะนำการ deploy สั้นๆ

1. ตั้งค่า environment variables ข้างต้นใน dashboard ของ platform ที่ใช้งาน (Render/Heroku/VPS)
2. ตรวจสอบว่า MySQL instance สามารถเข้าถึงจากเครื่องที่ deploy ได้
3. รัน `node init_db.js` เพื่อสร้างตาราง (หรือทำเป็น deploy hook)
4. (ไม่บังคับ) รัน `node seed_data.js` เพื่อใส่ข้อมูลเริ่มต้น
5. สร้าง frontend build ด้วย `cd ../frontend && npm install --legacy-peer-deps && npm run build` แล้วสตาร์ทเซิร์ฟเวอร์ด้วย `npm start` ในโฟลเดอร์ backend

## Social login / OAuth

ไฟล์นี้รวม placeholder endpoints `/auth/google` และ `/auth/facebook` หากต้องการเปิดใช้ social login ให้ตั้งค่า client id/secret ใน environment (ดู `.env.example`) และ implement OAuth callback flow ใน `server.js` หรือแยกไฟล์ controller แยกต่างหาก
หมายเหตุ: เซิร์ฟเวอร์จะเสิร์ฟไฟล์ build ของ React จาก `../frontend/build` และ expose API ที่ `/api/*`.
