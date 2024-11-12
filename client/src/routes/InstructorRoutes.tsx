import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import { getUserRole } from '../utils/auth';
import InstructorLogin from '../pages/instructor/InstructorLogin';
import InstructorProfile from '../pages/instructor/instructorProfile';

const isinstructor = getUserRole() === 'instructor';
console.log(isinstructor,"isinstructor")

const InstructorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InstructorLogin />} />
            <Route
                path="/instructor-dashboard"
                element={isinstructor ? <InstructorDashboard /> : <Navigate to="/" />}
            />
            <Route
                path="/instructor-Profile"
                element={isinstructor ? <InstructorProfile /> : <Navigate to="/" />}
            />
        </Routes>
    );
};

export default InstructorRoutes;
