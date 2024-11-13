import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import { getUserRole } from '../utils/auth';
import InstructorLogin from '../pages/instructor/InstructorLogin';
import InstructorProfile from '../pages/instructor/instructorProfile';
import ForgotPassword from '../pages/instructor/ForgotPassword';
import VerifyOtp from '../pages/instructor/VerifyOtp';
import { PasswordReset } from '../pages/instructor/PasswordReset';
import InstructorRegister from '../pages/instructor/instructorRegister';

const InstructorRoutes = () => {
    const value = localStorage.getItem('role');
    console.log(value,"ins")
    const isinstructor = value == 'instructor';
    console.log("isinstr",isinstructor);
    
    return (
        <Routes>
            <Route path="/" element={<InstructorLogin />} />
            <Route path="/tutor-register" element={<InstructorRegister />} />

            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/verify-otp" element={<VerifyOtp/>} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route
                path="/instructor-dashboard"
                element={<InstructorDashboard />}
            />
            <Route
                path="/instructor-Profile"
                element={isinstructor ? <InstructorProfile /> : <Navigate to="/instructor" />}
            />
        </Routes>
    );
};

export default InstructorRoutes;
