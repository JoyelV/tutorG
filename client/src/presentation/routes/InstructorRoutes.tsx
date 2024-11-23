import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import InstructorLogin from '../pages/instructor/InstructorLogin';
import InstructorProfile from '../pages/instructor/instructorProfile';
import ForgotPassword from '../pages/instructor/ForgotPassword';
import VerifyOtp from '../pages/instructor/VerifyOtp';
import { PasswordReset } from '../pages/instructor/PasswordReset';
import InstructorRegister from '../pages/instructor/instructorRegister';
import CreateCourse from '../pages/instructor/CreateCourse';

const InstructorRoutes = () => {
    const value = localStorage.getItem('role');
    console.log(value,"ins")
    const isInstructor = value === 'instructor';
    console.log("isinstr",isInstructor);
    
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
                path="/instructor-createCourse"
                element={isInstructor ? <CreateCourse /> : <Navigate to="/instructor" />}
            />
            <Route
                path="/instructor-Profile"
                element={isInstructor ? <InstructorProfile /> : <Navigate to="/instructor" />}
            />
        </Routes>
    );
};

export default InstructorRoutes;
