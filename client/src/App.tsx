import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import InstructorRoutes from './routes/InstructorRoutes';
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import { PasswordReset } from './pages/PasswordReset';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<UserRoutes />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/admin/*" element={<AdminRoutes />} /> 
                <Route path="/instructor/*" element={<InstructorRoutes />} /> 
            </Routes>
        </Router>
    );
};

export default App;
