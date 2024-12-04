import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import LandingPage from '../pages/LandingPage';
import UserProfile from '../pages/user/userProfile';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ViewCoursesListing from '../pages/user/ViewCoursesListing'
import DetailedCoursePage from '../pages/user/DetailedCoursePage';
import ForgotPassword from '../components/users/ForgotPassword';
import VerifyOtp from '../pages/user/VerifyOtp';
import { PasswordReset } from '../pages/user/PasswordReset';
import WishlistPage from '../pages/user/WishlistPage';
import CartPage from '../pages/user/CartPage';
import PaymentSuccessPage from '../pages/user/PaymentSuccessPage';

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
            <Route path="/course/details/:courseId" element={isLoggedIn ?<DetailedCoursePage />: <Navigate to="/login" />}/>
            <Route path="/wishlist" element={<WishlistPage />}/>
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/paymentSuccess" element={<PaymentSuccessPage/>} />
        </Routes>
        <Footer />
        </>
    );
};

export default UserRoutes;
