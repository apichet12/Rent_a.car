const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API ตัวอย่าง /api/cars
app.get('/api/cars', (req, res) => {
  const cars = [
    { id: 1, name: "Toyota Camry", price: 1000, seats: 5, fuel: "เบนซิน", image: "/img/toyota.jpg", desc: "รถสวย นั่งสบาย", features: ["แอร์", "ABS"] },
    { id: 2, name: "Honda Civic", price: 900, seats: 5, fuel: "เบนซิน", image: "/img/honda.jpg", desc: "ประหยัดน้ำมัน", features: ["GPS", "Bluetooth"] },
    { id: 3, name: "Tesla Model 3", price: 2500, seats: 5, fuel: "ไฟฟ้า", image: "/img/tesla.jpg", desc: "รถไฟฟ้า ทันสมัย", features: ["Autopilot", "Touchscreen"] },
  ];
  res.json(cars);
});

// หน้าแรก
app.get('/', (req, res) => {
  res.send('เช่ารถกับแคทตี้ Backend API พร้อมใช้งาน');
});

// Serve React frontend build
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// ทุก route ที่ไม่ใช่ /api/... ให้ React Router handle
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
