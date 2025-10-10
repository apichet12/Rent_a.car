import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarList from './pages/CarList';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import CustomerProfile from './pages/customer/CustomerProfile';
import CarsBrowse from './pages/CarsBrowse';
import Review from './pages/Review';
import Contact from './pages/Contact';
import CarDetail from './pages/CarDetail';
import Notifications from './pages/Notifications';
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/bookings" element={<CustomerBookings />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/cars-browse" element={<CarsBrowse />} />
          <Route path="/review" element={<Review />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
