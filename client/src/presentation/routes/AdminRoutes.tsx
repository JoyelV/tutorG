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

const AdminRoutes = () => {
    
    const values = localStorage.getItem('role');
    console.log(values,"admin")
    const isAdmin = values === 'admin';
    console.log(isAdmin,"admin?");
    
    return (
        <Routes>
            {/* Admin login route */}
            <Route path="/" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp/>} />
            <Route path="/reset-password" element={<PasswordReset />} />
            
            {/* Protected admin route */}
            <Route
                path="/dashboard"
                element={isAdmin ? <AdminDashboard />
                    : <Navigate to="/admin" />}/>
            <Route
                path="/category"
                element={isAdmin ? <CategoryPage />
                    : <Navigate to="/admin" />}/>
            <Route
                path="/users"
                element={isAdmin ? <UsersPage />
                    : <Navigate to="/admin" />}/>
            <Route
                path="/adminProfile"
                element={isAdmin ? <AdminProfile/>
                    : <Navigate to="/admin" />}/>
            <Route
                path="/add-tutor"
                element={isAdmin ? <AddForm /> : <Navigate to="/admin" />}
            />
        </Routes>
        
    );
};

export default AdminRoutes;