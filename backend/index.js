require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ตัวอย่างข้อมูลรถ
const cars = [
  { id: 1, name: 'Toyota Yaris', pricePerDay: 1000 },
  { id: 2, name: 'Honda Civic', pricePerDay: 1500 },
  { id: 3, name: 'Mazda CX-5', pricePerDay: 2000 }
];

// หน้าแรก
app.get('/', (req, res) => {
  res.send('เช่ารถกับแคทตี้ Backend API พร้อมใช้งาน');
});

// Route /cars
app.get('/cars', (req, res) => {
  res.json(cars);
});

// Route /cars/:id
app.get('/cars/:id', (req, res) => {
  const carId = Number(req.params.id);
  const car = cars.find(c => c.id === carId);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
