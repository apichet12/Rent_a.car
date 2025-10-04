require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('เช่ารถกับแคทตี้ Backend API พร้อมใช้งาน');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
