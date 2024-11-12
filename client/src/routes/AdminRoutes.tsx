import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { getUserRole } from '../utils/auth';
import AdminLogin from '../pages/admin/adminLogin';
import UsersPage from '../components/admin/UsersPage';
import AdminProfile from '../pages/admin/adminProfile'

const isAdmin = getUserRole() === 'admin';

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Admin login route */}
            <Route path="/" element={<AdminLogin />} />

            {/* Protected admin route */}
            <Route
                path="/dashboard"
                element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}/>
            <Route
                path="/users"
                element={isAdmin ? <UsersPage />
                    : <Navigate to="/" />}/>
            <Route
                path="/adminProfile"
                element={isAdmin ? <AdminProfile/>
                    : <Navigate to="/" />}/>
        </Routes>
        
    );
};

export default AdminRoutes;
