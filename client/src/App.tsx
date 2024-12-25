import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './presentation/routes/UserRoutes';
import AdminRoutes from './presentation/routes/AdminRoutes';
import InstructorRoutes from './presentation/routes/InstructorRoutes';
import Room from './presentation/pages/instructor/Room';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<UserRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} /> 
                <Route path="/instructor/*" element={<InstructorRoutes />} /> 
                <Route path="/chat/:roomId" element={<Room />} />
            </Routes>
        </Router>
    );
};

export default App;
