import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import InstructorRoutes from './routes/InstructorRoutes';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<UserRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} /> 
                <Route path="/instructor/*" element={<InstructorRoutes />} /> 
            </Routes>
        </Router>
    );
};

export default App;
