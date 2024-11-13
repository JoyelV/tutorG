import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import LandingPage from '../pages/LandingPage';
import UserProfile from '../pages/user/userProfile';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ViewCoursesListing from '../pages/user/ViewCoursesListing'
import DetailedCoursePage from '../pages/user/DetailedCoursePage';
import ForgotPassword from '../components/users/ForgotPassword';
import VerifyOtp from '../pages/user/VerifyOtp';
import { PasswordReset } from '../pages/user/PasswordReset';

const isLoggedIn = Boolean(localStorage.getItem('token'));

const UserRoutes = () => {
    return (
        <>
        <Header />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<PasswordReset />} />
            <Route
                path="/user-profile"
                element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />}
            />
            <Route path="/course-listing" element={<ViewCoursesListing />} />
            <Route path="/course/details/:id" element={<DetailedCoursePage />} />
        </Routes>
        <Footer />
        </>
    );
};

export default UserRoutes;
