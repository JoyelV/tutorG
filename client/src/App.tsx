import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/userProfile';
import Header from './components/Header';
import HeroSection2 from './components/HeroSection2'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PasswordReset from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    return (
        <Router>
            <Header />
            <Navbar />
            <hr></hr>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/resetPassword" element={<PasswordReset />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userProfile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />} />
            </Routes>
            <HeroSection2/>
            <Footer />
        </Router>
    );
};

export default App;
