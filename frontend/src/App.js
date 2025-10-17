// ✅ src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages
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
import ProfilePage from './pages/customer/ProfilePage'; 
import EditProfilePage from './pages/customer/EditProfilePage'; // ✅ เหลือแค่บรรทัดนี้
import PersonalDataForm from './pages/customer/PersonalDataForm';
import CarsBrowse from './pages/CarsBrowse';
import Review from './pages/Review';
import Contact from './pages/Contact';
import CarDetail from './pages/CarDetail';
import Notifications from './pages/Notifications';
import BookingHelp from './pages/help/BookingHelp';
import DocsHelp from './pages/help/DocsHelp';
import InsuranceHelp from './pages/help/InsuranceHelp';
import MoreHelp from './pages/help/MoreHelp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import DataDeletionRequest from './pages/DataDeletionRequest';
import Tuition from './pages/Tuition';
import './App.css';
import './responsive.css';
import 'react-datepicker/dist/react-datepicker.css';
import AccountSettingsPage from './pages/customer/AccountSettingsPage';

const AppContent = () => {
  const location = useLocation();
  const NO_NAVBAR_ROUTES = ['/login', '/register', '/customer/profile'];
  const isHiddenRoute = NO_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <div style={{
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      {!isHiddenRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carlist" element={<CarList />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
        <Route path="/customer/edit-profile" element={<EditProfilePage />} /> {/* ✅ ใช้อันนี้อันเดียว */}

        <Route path="/customer/personal-data" element={<PersonalDataForm />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<AdminCars />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/bookings" element={<CustomerBookings />} />
        <Route path="/customer/dropdown" element={<CustomerProfile />} />
        <Route path="/cars-browse" element={<CarsBrowse />} />
        <Route path="/review" element={<Review />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help/booking" element={<BookingHelp />} />
        <Route path="/help/docs" element={<DocsHelp />} />
        <Route path="/help/insurance" element={<InsuranceHelp />} />
        <Route path="/help/more" element={<MoreHelp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletionRequest />} />
        <Route path="/tuition" element={<Tuition />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
