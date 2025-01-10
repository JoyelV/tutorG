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
import { useAuth } from '../../infrastructure/context/AuthContext';

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
    throw new Error("Stripe public key is missing in environment variables.");
}

const stripePromise = loadStripe(stripePublicKey);

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { auth } = useAuth();
    return auth?.role === 'instructor' ? element : <Navigate to="/instructor/" />;
};

const InstructorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InstructorLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/verify-otp" element={<VerifyOtp/>} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route
                path="/instructor-dashboard"
                element={<PrivateRoute element={<InstructorDashboard />} />}
            />
            <Route
                path="/instructor-createCourse"
                element={<PrivateRoute element={<CreateCourse />} />}
            />
            <Route
                path="/add-lesson/:courseId"
                element={<PrivateRoute element={<AddLesson/>} />}
            />     
             <Route
                path="/edit-lesson/:lessonId"
                element={<PrivateRoute element={<EditLesson/>} />}
            />     
            <Route
                path="/my-courses"
                element={<PrivateRoute element={ <MyCourses />} />}
            />    
             <Route
                path="/messages"
                element={<PrivateRoute element={<ChatApp />} />}
            /> 
            <Route
                path="/my-students"
                element={<PrivateRoute element={<StudentsList />} />}
            />
            <Route
                path="/my-earnings"
                element={
                    <PrivateRoute
                        element={
                            <Elements stripe={stripePromise}>
                                <Earnings />
                            </Elements>
                        }
                    />
                }
            />   
            <Route path="/course-view/:courseId" element={<PrivateRoute element={<ErrorBoundary>< CourseView /></ErrorBoundary>}/>}
            />
            <Route path="/course-edit/:courseId" element={<PrivateRoute element={<EditCourse />} />} 
            />
            
            <Route path="/addQuiz/:courseId" element={<PrivateRoute element={<AddQuizForm />} />}/>
            <Route path="/quizzes/:courseId/edit/:quizId" element={<PrivateRoute element={<EditQuizForm />} />}/>
            <Route
                path="/instructor-Profile"
                element={<PrivateRoute element={<InstructorProfile />}/>}
            />
            <Route path="*" element={<Pagenotfound />} />
        </Routes>
    );
};

export default InstructorRoutes;
