import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../../infrastructure/context/AuthContext';
import Loader from '../components/common/Loader';

const Login = lazy(() => import('../pages/user/Login'));
const Register = lazy(() => import('../pages/user/Register'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const UserProfile = lazy(() => import('../pages/user/userProfile'));
const ViewCoursesListing = lazy(() => import('../pages/user/ViewCoursesListing'));
const DetailedCoursePage = lazy(() => import('../pages/user/DetailedCoursePage'));
const ForgotPassword = lazy(() => import('../components/users/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/user/VerifyOtp'));
const PasswordReset = lazy(() => import('../pages/user/PasswordReset').then(module => ({ default: module.PasswordReset })));
const WishlistPage = lazy(() => import('../pages/user/WishlistPage'));
const CartPage = lazy(() => import('../pages/user/CartPage'));
const PaymentSuccessPage = lazy(() => import('../pages/user/PaymentSuccessPage'));
const SingleEnrolledCoursePage = lazy(() => import('../pages/user/SingleEnrolledCoursePage'));
const Pagenotfound = lazy(() => import('../components/common/PageNotFound'));
const BecomeInstructor = lazy(() => import('../components/common/BecomeInstructor'));
const AboutPage = lazy(() => import('../pages/user/AboutPage'));
const ContactPage = lazy(() => import('../pages/user/ContactPage'));
const Notifications = lazy(() => import('../pages/user/NotificationPage'));
const InstructorProfile = lazy(() => import('../pages/user/InstructorProfile'));

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { auth } = useAuth();
    return auth?.role === 'user' ? element : <Navigate to="/login" replace />;
};

const UserRoutes = () => {
    const location = useLocation();
    const hideNavFooter = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'].includes(location.pathname);

    return (
        <>
            {!hideNavFooter && <Navbar />}
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route
                        path="/user-profile"
                        element={<PrivateRoute element={<UserProfile />} />}
                    />
                    <Route path="/become-an-instructor" element={<BecomeInstructor />} />
                    <Route path="/instructorProfile/:id" element={<InstructorProfile />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/course-listing" element={<ViewCoursesListing />} />
                    <Route path="/course/details/:courseId" element={<DetailedCoursePage />} />
                    <Route path="/wishlist" element={<PrivateRoute element={<WishlistPage />} />} />
                    <Route path="/cart" element={<PrivateRoute element={<CartPage />} />} />
                    <Route path="/paymentSuccess" element={<PrivateRoute element={<PaymentSuccessPage />} />} />
                    <Route path="/enrolled-singlecourse/:courseId" element={<PrivateRoute element={<SingleEnrolledCoursePage />} />} />
                    <Route path="*" element={<Pagenotfound />} />
                </Routes>
            </Suspense>
            {!hideNavFooter && <Footer />}
        </>
    );
};

export default UserRoutes;
