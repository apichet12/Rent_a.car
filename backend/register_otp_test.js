require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ใช้ Dev Mode ถ้า Twilio ไม่ทำงาน
const DEV_MODE = true; // true = แสดง OTP ใน console แทนส่งจริง

// =======================
// OTP Storage (ชั่วคราว)
// =======================
const otpStore = {}; // key = phone, value = code

// =======================
// API Routes
// =======================

// ส่ง OTP
app.post('/api/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์โทร' });

    let otpCode;
    if (DEV_MODE) {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[phone] = otpCode;
      console.log(`[DEV] OTP for ${phone}: ${otpCode}`);
      return res.json({ success: true, message: 'ส่ง OTP สำเร็จ (Dev Mode)', code: otpCode });
    }

    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });

    console.log('OTP sent:', verification.sid);
    res.json({ success: true, message: 'ส่ง OTP สำเร็จ', sid: verification.sid });
  } catch (err) {
    console.error('OTP send error:', err.message || err);
    res.status(500).json({ success: false, message: 'ส่ง OTP ไม่สำเร็จ', error: err.message });
  }
});

// ตรวจสอบ OTP
app.post('/api/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, message: 'กรุณากรอกเบอร์และรหัส OTP' });

    if (DEV_MODE) {
      if (otpStore[phone] === code) {
        delete otpStore[phone]; // ลบหลัง verify สำเร็จ
        return res.json({ success: true, message: 'ยืนยัน OTP สำเร็จ (Dev Mode)' });
      } else {
        return res.status(400).json({ success: false, message: 'รหัส OTP ไม่ถูกต้อง (Dev Mode)' });
      }
    }

    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      res.json({ success: true, message: 'ยืนยัน OTP สำเร็จ' });
    } else {
      res.status(400).json({ success: false, message: 'รหัส OTP ไม่ถูกต้อง' });
    }
  } catch (err) {
    console.error('OTP verify error:', err.message || err);
    res.status(500).json({ success: false, message: 'ตรวจสอบ OTP ไม่สำเร็จ', error: err.message });
  }
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ OTP Server running on port ${PORT}`));
