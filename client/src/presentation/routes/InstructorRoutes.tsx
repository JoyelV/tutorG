import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import InstructorLogin from '../pages/instructor/InstructorLogin';
import InstructorProfile from '../pages/instructor/instructorProfile';
import ForgotPassword from '../pages/instructor/ForgotPassword';
import VerifyOtp from '../pages/instructor/VerifyOtp';
import { PasswordReset } from '../pages/instructor/PasswordReset';
import InstructorRegister from '../pages/instructor/instructorRegister';
import CreateCourse from '../pages/instructor/CreateCourse';
import MyCourses from '../pages/instructor/MyCourses';
import ErrorBoundary from '../../utils/ErrorBoundary';
import CourseView from '../pages/instructor/CourseView';
import AddLesson from '../pages/instructor/AddLesson';
import EditCourse from '../pages/instructor/EditCourse';

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
                element={isInstructor ?<InstructorDashboard />: <Navigate to="/instructor" />}
            />
            <Route
                path="/instructor-createCourse"
                element={isInstructor ? <CreateCourse /> : <Navigate to="/instructor" />}
            />
            <Route
                path="/add-lesson/:courseId"
                element={isInstructor ? <AddLesson/> : <Navigate to="/instructor" />}
            />        
            <Route
                path="/my-courses"
                element={isInstructor ? <MyCourses /> : <Navigate to="/instructor" />}
            />    
            <Route path="/course-view/:courseId" element={isInstructor ? <ErrorBoundary>< CourseView /></ErrorBoundary>: <Navigate to="/instructor" />}
            />
            <Route path="/course-edit/:courseId" element={isInstructor ? <EditCourse />: <Navigate to="/instructor" />} 
            />
            <Route
                path="/instructor-Profile"
                element={isInstructor ? <InstructorProfile /> : <Navigate to="/instructor" />}
            />
        </Routes>
    );
};

export default InstructorRoutes;
