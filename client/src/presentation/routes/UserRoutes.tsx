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
import SingleEnrolledCoursePage from '../pages/user/SingleEnrolledCoursePage';
import Pagenotfound from '../components/common/PageNotFound';
import BecomeInstructor from '../components/common/BecomeInstructor';
import AboutPage from '../pages/user/AboutPage';
import ContactPage from '../pages/user/ContactPage';
import CertificateOfCompletion from '../pages/user/CompletionCertificatePage';

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
            <Route path="/become-an-instructor" element={<BecomeInstructor />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/course-listing" element={<ViewCoursesListing />} />
            <Route path="/course/details/:courseId" element={<DetailedCoursePage />}/>
            <Route path="/wishlist" element={isLoggedIn ?<WishlistPage />: <Navigate to="/login" />}/>
            <Route path="/cart" element={isLoggedIn ?<CartPage/>: <Navigate to="/login" />} />
            <Route path="/paymentSuccess" element={isLoggedIn ?<PaymentSuccessPage/>: <Navigate to="/login" />} />
            <Route path="/enrolled-singlecourse/:courseId" element={<SingleEnrolledCoursePage/>} />
            <Route path="/completion-certificate/:courseId" element={<CertificateOfCompletion/>} />
            <Route path="*" element={<Pagenotfound />} />
        </Routes>
        <Footer />
        </>
    );
};

export default UserRoutes;
