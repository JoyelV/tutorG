import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Sidebar from '../../components/admin/Sidebar';
import TopNav from '../../components/admin/TopNav';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard: React.FC = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales 2023',
                data: [300, 400, 500, 700, 800, 950, 1200, 1300, 1450, 1600, 1750, 1900],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Sales 2024',
                data: [400, 500, 600, 850, 900, 1100, 1250, 1400, 1550, 1700, 1850, 2000],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                 <Sidebar/>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
            <TopNav/>
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h1>
                <p className="text-gray-600 mb-6">Good Morning, Mr. Admin. It’s good to see you again.</p>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Total Commission</h2>
                        <p className="mt-2 text-2xl font-bold text-green-500">$100K</p>
                        <p className="text-gray-500">Life Time Courses Commission</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Received Commission</h2>
                        <p className="mt-2 text-2xl font-bold text-green-500">$80,000.0</p>
                        <p className="text-gray-500">Life Time Received Commission</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Paid Amount</h2>
                        <p className="mt-2 text-2xl font-bold text-green-500">$20,000.00</p>
                        <p className="text-gray-500">Life Time Paid Amount</p>
                    </div>
                </div>

                {/* Sales Chart */}
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700">Life Time Sales</h2>
                    <div className="mt-4">
                        <Line data={data} options={{ responsive: true }} />
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">Total Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-gray-800">1000</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">1 Star Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-red-500">100</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">2 Star Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-yellow-500">100</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">3 Star Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-yellow-500">100</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">4 Star Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-green-500">100</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h3 className="text-center text-sm font-semibold text-gray-600">5 Star Reviews</h3>
                        <p className="mt-2 text-center text-2xl font-bold text-green-500">100</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
