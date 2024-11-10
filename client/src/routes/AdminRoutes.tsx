import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { getUserRole } from '../utils/auth';
import AdminLogin from '../pages/admin/adminLogin';

const isAdmin = getUserRole() === 'admin';

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Admin login route */}
            <Route path="/" element={<AdminLogin />} />

            {/* Protected admin route */}
            <Route
                path="/dashboard"
                element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />

            {/* Add other admin-specific routes, protected similarly */}
        </Routes>
    );
};

export default AdminRoutes;
