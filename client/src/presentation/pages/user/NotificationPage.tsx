import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import api from '../../../infrastructure/api/api';
import Navbar from '../../components/common/Navbar';
import { CircularProgress } from '@mui/material';

interface Notification {
    tutorId: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsPerPage] = useState(5);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/user/notifications');
                setNotifications(response.data.notifications);
            } catch {
                setError('Failed to fetch notifications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const totalPages = Math.ceil(notifications.length / notificationsPerPage);
    const currentNotifications = notifications.slice(
        (currentPage - 1) * notificationsPerPage,
        currentPage * notificationsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          );
    }

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <Navbar />
            <section className="py-8 lg:py-24 relative min-h-screen flex flex-col">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto flex-grow">
                    <h2 className="text-2xl font-bold text-center text-sky-500">NOTIFICATIONS</h2>
                    <div className="border-t border-sky-200 py-3">
                        {currentNotifications.length > 0 ? (
                            <ul className="divide-y divide-sky-200">
                                {currentNotifications.map((notification) => (
                                    <li
                                        key={notification.tutorId}
                                        className={`p-5 ${notification.isRead ? 'bg-gray-100' : 'bg-white'} flex justify-between items-center`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <img
                                                src={notification.thumbnail}
                                                alt={notification.title}
                                                className="w-80 h-30 rounded-md"
                                            />
                                        </div>
                                        <div className="ml-5"> 
                                            <p className="font-bold text-sky-600">{notification.title}</p>
                                            <p className="font-bold text-sky-600">{notification.subtitle}</p>
                                            <p className="text-gray-500">{notification.message}</p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-16">
                                <h2 className="text-2xl font-bold text-sky-600">No Notifications</h2>
                                <p className="text-gray-500 mt-4">You don’t have any notifications yet.</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'}`}
                        >
                            Previous
                        </button>
                        <p className="text-gray-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md text-white ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </section>
        </div>
    );
};

export default NotificationPage;
