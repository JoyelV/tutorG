import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import { getUserRole } from '../utils/auth';
import InstructorLogin from '../pages/instructor/InstructorLogin';

const isinstructor = getUserRole() === 'instructor';

const InstructorRoutes = () => {
    return (
        <Routes>
            {/* Admin login route */}
            <Route path="/" element={<InstructorLogin />} />

            {/* Protected admin route */}
            <Route
                path="/dashboard"
                element={isinstructor ? <InstructorDashboard /> : <Navigate to="/" />}
            />

            {/* Add other admin-specific routes, protected similarly */}
        </Routes>
    );
};

export default InstructorRoutes;
