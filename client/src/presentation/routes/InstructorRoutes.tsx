import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../../infrastructure/context/AuthContext';
import ErrorBoundary from '../../utils/ErrorBoundary';
import InstructorLayout from '../components/instructor/InstructorLayout';

const InstructorDashboard = lazy(() => import('../pages/instructor/InstructorDashboard'));
const InstructorLogin = lazy(() => import('../pages/instructor/InstructorLogin'));
const InstructorProfile = lazy(() => import('../pages/instructor/instructorProfile'));
const ForgotPassword = lazy(() => import('../pages/instructor/ForgotPassword'));
const VerifyOtp = lazy(() => import('../pages/instructor/VerifyOtp'));
const PasswordReset = lazy(() => import('../pages/instructor/PasswordReset').then(module => ({ default: module.PasswordReset })));
const CreateCourse = lazy(() => import('../pages/instructor/CreateCourse'));
const MyCourses = lazy(() => import('../pages/instructor/MyCourses'));
const CourseView = lazy(() => import('../pages/instructor/CourseView'));
const AddLesson = lazy(() => import('../pages/instructor/AddLesson'));
const EditCourse = lazy(() => import('../pages/instructor/EditCourse'));
const EditLesson = lazy(() => import('../pages/instructor/EditLesson'));
const AddQuizForm = lazy(() => import('../pages/instructor/AddQuiz'));
const EditQuizForm = lazy(() => import('../pages/instructor/EditQuizForm'));
const StudentsList = lazy(() => import('../pages/instructor/MyStudentsList'));
const Pagenotfound = lazy(() => import('../components/common/PageNotFound'));
const Earnings = lazy(() => import('../pages/instructor/MyEarnings'));
const ChatApp = lazy(() => import('../pages/instructor/Messages'));

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
    throw new Error("Stripe public key is missing in environment variables.");
}

const stripePromise = loadStripe(stripePublicKey);

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const { auth } = useAuth();
    return auth?.role === 'instructor' ? element : <Navigate to="/instructor/" replace />;
};

const InstructorRoutes = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Instructor Routes */}
                <Route path="/" element={<InstructorLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<PasswordReset />} />

                {/* Protected Instructor Routes with Layout */}
                <Route element={<PrivateRoute element={<InstructorLayout />} />}>
                    <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
                    <Route path="/instructor-createCourse" element={<CreateCourse />} />
                    <Route path="/add-lesson/:courseId" element={<AddLesson />} />
                    <Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
                    <Route path="/my-courses" element={<MyCourses />} />
                    <Route path="/messages" element={<ChatApp />} />
                    <Route path="/my-students" element={<StudentsList />} />
                    <Route
                        path="/my-earnings"
                        element={
                            <Elements stripe={stripePromise}>
                                <Earnings />
                            </Elements>
                        }
                    />
                    <Route path="/course-view/:courseId" element={<ErrorBoundary><CourseView /></ErrorBoundary>} />
                    <Route path="/course-edit/:courseId" element={<EditCourse />} />
                    <Route path="/addQuiz/:courseId" element={<AddQuizForm />} />
                    <Route path="/quizzes/:courseId/edit/:quizId" element={<EditQuizForm />} />
                    <Route path="/instructor-Profile" element={<InstructorProfile />} />
                </Route>

                <Route path="*" element={<Pagenotfound />} />
            </Routes>
        </Suspense>
    );
};

export default InstructorRoutes;
