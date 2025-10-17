import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useIsMobile } from './hooks/useIsMobile';
import MobileNav from './components/mobile/MobileNav';

// Pages - Desktop
import Home from './pages/Home';
import ProfilePage from './pages/customer/ProfilePage';
import EditProfilePage from './pages/customer/EditProfilePage';
import CustomerProfile from './pages/customer/CustomerProfile';

// Pages - Mobile
import HomeMobile from './pages/Home/Home.mobile';
import ProfileMobile from './pages/customer/Profile.mobile';
import EditProfileMobile from './pages/customer/EditProfile.mobile';
import CustomerProfileMobile from './pages/customer/CustomerProfile.mobile';
import SearchScreenMobile from './pages/customer/SearchScreen.mobile';

// Pages อื่น ๆ
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
import AccountSettingsPage from './pages/customer/AccountSettingsPage';

import './App.css';
import './responsive.css';
import 'react-datepicker/dist/react-datepicker.css';

const AppContent = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const NO_NAVBAR_ROUTES = ['/login', '/register'];
  const isHiddenRoute = NO_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <div
      style={{
        minHeight: '100vh',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        paddingBottom: isMobile ? 64 : 0,
      }}
    >
      {/* Desktop Navbar */}
      {!isHiddenRoute && !isMobile && <Navbar />}

      <Routes>
        {/* Home */}
        <Route path="/" element={isMobile ? <HomeMobile /> : <Home />} />

        {/* Search */}
        <Route path="/search" element={isMobile ? <SearchScreenMobile /> : <Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Car Routes */}
        <Route path="/carlist" element={<CarList />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />

        {/* Customer Profile */}
        <Route path="/customer/profile" element={isMobile ? <ProfileMobile /> : <ProfilePage />} />
        <Route path="/customer/edit-profile" element={isMobile ? <EditProfileMobile /> : <EditProfilePage />} />
        <Route path="/customer/dropdown" element={isMobile ? <CustomerProfileMobile /> : <CustomerProfile />} />

        {/* Other Customer Pages */}
        <Route path="/customer/personal-data" element={<PersonalDataForm />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/bookings" element={<CustomerBookings />} />

        {/* Other Pages */}
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<AdminCars />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
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

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav />}
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
