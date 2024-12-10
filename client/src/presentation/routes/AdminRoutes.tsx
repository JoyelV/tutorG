import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLogin from '../pages/admin/adminLogin';
import UsersPage from '../components/admin/UsersPage';
import AdminProfile from '../pages/admin/adminProfile'
import ForgotPassword from '../components/admin/ForgotPassword';
import VerifyOtp from '../pages/admin/VerifyOtp';
import { PasswordReset } from '../pages/admin/PasswordReset';
import AddForm from '../pages/admin/AddTutor';
import CategoryPage from '../pages/admin/CategoryPage';
import CoursesList from '../pages/admin/coursesList';
import ErrorBoundary from '../../utils/ErrorBoundary';
import CourseViewPage from '../pages/admin/ViewCourse';
import AddReviewForm from '../pages/admin/AddReview';
import Pagenotfound from '../components/common/PageNotFound';

const AdminRoutes = () => {
    const values = localStorage.getItem('role');
    const isAdmin = values === 'admin';

    return (
        <Routes>
            {/* Admin login route */}
            <Route path="/" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<PasswordReset />} />

            {/* Protected admin route */}
            <Route
                path="/dashboard"
                element={isAdmin ? <AdminDashboard />
                    : <Navigate to="/admin" />} />

            <Route
                path="/category"
                element={isAdmin ? <CategoryPage />
                    : <Navigate to="/admin" />} />

            <Route
                path="/courses"
                element={isAdmin ? <CoursesList />
                    : <Navigate to="/admin" />} />

            <Route
                path="/users"
                element={isAdmin ? <UsersPage />
                    : <Navigate to="/admin" />} />
            <Route
                path="/viewCoursePage/:courseId" element={isAdmin ? < CourseViewPage /> : <Navigate to="/admin" />} />
            <Route path="/addReview/:courseId" element={isAdmin ? <AddReviewForm /> : <Navigate to="/admin" />} />
            <Route
                path="/adminProfile"
                element={isAdmin ? <AdminProfile />
                    : <Navigate to="/admin" />} />
            <Route
                path="/add-tutor"
                element={isAdmin ? <AddForm /> : <Navigate to="/admin" />}
            />
            <Route path="*" element={<Pagenotfound />} />
        </Routes>

    );
};

export default AdminRoutes;
