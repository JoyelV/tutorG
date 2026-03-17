import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../../infrastructure/context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';

const AdminLogin = lazy(() => import('../pages/admin/adminLogin'));
const UsersPage = lazy(() => import('../components/admin/UsersPage'));
const AdminProfile = lazy(() => import('../pages/admin/adminProfile'));
const ForgotPassword = lazy(() => import('../components/admin/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/admin/VerifyOtp'));
const PasswordReset = lazy(() => import('../pages/admin/PasswordReset').then(module => ({ default: module.PasswordReset })));
const AddForm = lazy(() => import('../pages/admin/AddTutor'));
const CategoryPage = lazy(() => import('../pages/admin/CategoryPage'));
const CoursesList = lazy(() => import('../pages/admin/coursesList'));
const CourseViewPage = lazy(() => import('../pages/admin/ViewCourse'));
const AddReviewForm = lazy(() => import('../pages/admin/AddReview'));
const Pagenotfound = lazy(() => import('../components/common/PageNotFound'));
const OrdersTable = lazy(() => import('../pages/admin/OrderTableList'));
const OrderView = lazy(() => import('../pages/admin/OrderDetailPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { auth } = useAuth();
    return auth?.role === 'admin' ? element : <Navigate to="/admin/" />;
};

const AdminRoutes = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Admin Routes */}
                <Route path="/" element={<AdminLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<PasswordReset />} />

                {/* Protected Admin Routes with Layout */}
                <Route element={<PrivateRoute element={<AdminLayout />} />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/category" element={<CategoryPage />} />
                    <Route path="/courses" element={<CoursesList />} />
                    <Route path="/orders" element={<OrdersTable />} />
                    <Route path="/orderDetail/:orderId" element={<OrderView />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/viewCoursePage/:courseId" element={<CourseViewPage />} />
                    <Route path="/addReview/:courseId" element={<AddReviewForm />} />
                    <Route path="/adminProfile" element={<AdminProfile />} />
                    <Route path="/add-tutor" element={<AddForm />} />
                </Route>

                <Route path="*" element={<Pagenotfound />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;
