import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './components/Navbar'; // Assuming NavbarLogin is renamed to Navbar
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// ... (all other page imports)
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
import BookingHelp from './pages/help/BookingHelp';
import DocsHelp from './pages/help/DocsHelp';
import InsuranceHelp from './pages/help/InsuranceHelp';
import MoreHelp from './pages/help/MoreHelp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import DataDeletionRequest from './pages/DataDeletionRequest';
import Tuition from './pages/Tuition';

import './App.css';
import './i18n';
import './responsive.css';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Component that determines which routes should NOT show the Navbar.
 * It must be a separate component so it can use the useLocation hook
 * which requires being inside the Router context.
 */
const AppContent = () => {
    const location = useLocation();

    // Define routes where the navbar should be hidden
    const NO_NAVBAR_ROUTES = ['/login', '/register'];

    // Check if the current path is one of the hidden routes
    const isHiddenRoute = NO_NAVBAR_ROUTES.includes(location.pathname);

    return (
        // The global div to prevent content copying is still applied here
        <div style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
        }}>
            {/* Conditional rendering: Navbar is rendered ONLY if it's NOT a hidden route */}
            {!isHiddenRoute && <Navbar />}

            {/* Routes are always rendered */}
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
                <Route path="/help/booking" element={<BookingHelp />} />
                <Route path="/help/docs" element={<DocsHelp />} />
                <Route path="/help/insurance" element={<InsuranceHelp />} />
                <Route path="/help/more" element={<MoreHelp />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/data-deletion" element={<DataDeletionRequest />} />
                <Route path="/tuition" element={<Tuition />} />
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