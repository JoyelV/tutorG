import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/adminLogin';
import UsersPage from '../components/admin/UsersPage';
import AdminProfile from '../pages/admin/adminProfile'
import ForgotPassword from '../components/admin/ForgotPassword';
import VerifyOtp from '../pages/admin/VerifyOtp';
import { PasswordReset } from '../pages/admin/PasswordReset';
import AddForm from '../pages/admin/AddTutor';
import CategoryPage from '../pages/admin/CategoryPage';
import CoursesList from '../pages/admin/coursesList';
import CourseViewPage from '../pages/admin/ViewCourse';
import AddReviewForm from '../pages/admin/AddReview';
import Pagenotfound from '../components/common/PageNotFound';
import OrdersTable from '../pages/admin/OrderTableList';
import OrderView from '../pages/admin/OrderDetailPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { useAuth } from '../../infrastructure/context/AuthContext';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { auth } = useAuth();
    return auth?.role === 'admin' ? element : <Navigate to="/admin/" />;
};

const AdminRoutes = () => {
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
                element={<PrivateRoute element={<AdminDashboard /> }/>} />

            <Route
                path="/category"
                element={<PrivateRoute element={ <CategoryPage />} />} />

            <Route
                path="/courses"
                element={<PrivateRoute element={<CoursesList />} />} />
             <Route
                path="/orders"
                element={<PrivateRoute element={<OrdersTable />} />} />
            <Route
                path="/orderDetail/:orderId"
                element={<PrivateRoute element={<OrderView />} />} />
            <Route
                path="/users"
                element={<PrivateRoute element={<UsersPage />} />} />
            <Route
                path="/viewCoursePage/:courseId" element={<PrivateRoute element={< CourseViewPage />} />} />
            <Route path="/addReview/:courseId" element={<PrivateRoute element={<AddReviewForm />} />} />
            <Route
                path="/adminProfile"
                element={<PrivateRoute element={<AdminProfile />} />} />
            <Route
                path="/add-tutor"
                element={<PrivateRoute element={<AddForm />} />}
            />
            <Route path="*" element={<Pagenotfound />} />
        </Routes>

    );
};

export default AdminRoutes;
