import { Route, Routes, Navigate } from 'react-router-dom';
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import InstructorLogin from '../pages/instructor/InstructorLogin';
import InstructorProfile from '../pages/instructor/instructorProfile';
import ForgotPassword from '../pages/instructor/ForgotPassword';
import VerifyOtp from '../pages/instructor/VerifyOtp';
import { PasswordReset } from '../pages/instructor/PasswordReset';
import CreateCourse from '../pages/instructor/CreateCourse';
import MyCourses from '../pages/instructor/MyCourses';
import ErrorBoundary from '../../utils/ErrorBoundary';
import CourseView from '../pages/instructor/CourseView';
import AddLesson from '../pages/instructor/AddLesson';
import EditCourse from '../pages/instructor/EditCourse';
import EditLesson from '../pages/instructor/EditLesson'
import AddQuizForm from '../pages/instructor/AddQuiz';
import EditQuizForm from '../pages/instructor/EditQuizForm';
import StudentsList from '../pages/instructor/MyStudentsList';
import Pagenotfound from '../components/common/PageNotFound';
import Earnings from '../pages/instructor/MyEarnings';
import ChatApp from '../pages/instructor/Messages';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
    throw new Error("Stripe public key is missing in environment variables.");
}

const stripePromise = loadStripe(stripePublicKey);

const InstructorRoutes = () => {
    const value = localStorage.getItem('role');
    const isInstructor = value === 'instructor';

    return (
        <Routes>
            <Route path="/" element={<InstructorLogin />} />
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
                path="/edit-lesson/:lessonId"
                element={isInstructor ? <EditLesson/> : <Navigate to="/instructor" />}
            />     
            <Route
                path="/my-courses"
                element={isInstructor ? <MyCourses /> : <Navigate to="/instructor" />}
            />    
             <Route
                path="/messages"
                element={isInstructor ? <ChatApp /> : <Navigate to="/instructor" />}
            /> 
            <Route
                path="/my-students"
                element={isInstructor ? <StudentsList /> : <Navigate to="/instructor" />}
            />
            <Route
                path="/my-earnings"
                element={isInstructor ?  <Elements stripe={stripePromise}>
                <Earnings />
              </Elements> : <Navigate to="/instructor" />}
            />     
            <Route path="/course-view/:courseId" element={isInstructor ? <ErrorBoundary>< CourseView /></ErrorBoundary>: <Navigate to="/instructor" />}
            />
            <Route path="/course-edit/:courseId" element={isInstructor ? <EditCourse />: <Navigate to="/instructor" />} 
            />
            
            <Route path="/addQuiz/:courseId" element={isInstructor ?<AddQuizForm />: <Navigate to="/instructor" />}/>
            <Route path="/quizzes/:courseId/edit/:quizId" element={isInstructor ?<EditQuizForm />: <Navigate to="/instructor" />}/>
            <Route
                path="/instructor-Profile"
                element={isInstructor ? <InstructorProfile /> : <Navigate to="/instructor" />}
            />
            <Route path="*" element={<Pagenotfound />} />
        </Routes>
    );
};

export default InstructorRoutes;
