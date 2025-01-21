import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { FaShoppingCart, FaBook, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import api from '../../../infrastructure/api/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import Sidebar from '../../components/admin/Sidebar';
import TopNav from '../../components/admin/TopNav';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface Order {
    createdAt: string;
    amount: number;
}

interface Course {
    title: string;
    rating: number;
}

interface Tutor {
    username: string;
}

interface DashboardData {
    orders: Order[];
    courses: Course[];
    tutors: Tutor[];
    users: any[];
}

const AdminDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        orders: [],
        courses: [],
        tutors: [],
        users: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, coursesRes, tutorsRes, usersRes] = await Promise.all([
                    api.get('/admin/orders'),
                    api.get('/admin/courseData'),
                    api.get('/admin/instructors'),
                    api.get('/admin/users'),
                ]);

                setDashboardData({
                    orders: ordersRes.data.total,
                    courses: coursesRes.data.total, 
                    tutors: tutorsRes.data,
                    users: usersRes.data,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const orderData = {
        labels: dashboardData.orders.map(order => new Date(order.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Order Amounts',
                data: dashboardData.orders.map(order => order.amount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const courseData = {
        labels: dashboardData.courses.map(course => course.title),
        datasets: [
            {
                label: 'Course Ratings',
                data: dashboardData.courses.map(course => course.rating),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 bg-gray-800 text-white">
                <Sidebar />
            </aside>
    
            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <TopNav />
    
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                    Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                    Hey Admin. It’s good to see you again.
                </p>
    
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-white shadow rounded-lg flex items-center">
                        <div className="text-blue-500 text-xl mr-3">
                            <FaShoppingCart />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Orders</h2>
                            <p className="mt-1 text-lg font-bold text-blue-500">{dashboardData.orders.length}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg flex items-center">
                        <div className="text-green-500 text-xl mr-3">
                            <FaBook />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Courses</h2>
                            <p className="mt-1 text-lg font-bold text-green-500">{dashboardData.courses.length}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg flex items-center">
                        <div className="text-orange-500 text-xl mr-3">
                            <FaChalkboardTeacher />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Tutors</h2>
                            <p className="mt-1 text-lg font-bold text-orange-500">{dashboardData.tutors.length}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg flex items-center">
                        <div className="text-purple-500 text-xl mr-3">
                            <FaUsers />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Users</h2>
                            <p className="mt-1 text-lg font-bold text-purple-500">{dashboardData.users.length}</p>
                        </div>
                    </div>
                </div>
    
                {/* Graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white shadow rounded-lg p-4 md:p-6">
                        <h2 className="text-base md:text-lg font-semibold text-gray-700">
                            Orders Overview
                        </h2>
                        <div className="mt-4">
                            <Line data={orderData} options={{ responsive: true }} />
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 md:p-6">
                        <h2 className="text-base md:text-lg font-semibold text-gray-700">
                            Courses Overview
                        </h2>
                        <div className="mt-4">
                            <Bar data={courseData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );    
};

export default AdminDashboard;
