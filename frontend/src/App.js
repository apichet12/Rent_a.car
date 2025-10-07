import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarList from './pages/CarList';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Review from './pages/Review';
import Contact from './pages/Contact';
import CarDetail from './pages/CarDetail';
import './App.css';
import './i18n';
import './responsive.css';
import 'react-datepicker/dist/react-datepicker.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/* ครอบเว็บด้วย div global ป้องกันการคัดลอก */}
      <div style={{
        userSelect: 'none',          // ป้องกันเลือกข้อความทั่วไป
        WebkitUserSelect: 'none',    // ป้องกัน Safari / Chrome
        MozUserSelect: 'none',       // ป้องกัน Firefox
        msUserSelect: 'none'         // ป้องกัน IE / Edge
      }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/carlist" element={<CarList />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
