import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar - Remains stable across navigation */}
            <aside className="hidden md:block w-64 bg-gray-800 text-white flex-shrink-0">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* TopNav - Remains stable across navigation */}
                <TopNav />

                {/* Dynamic Content - Changes on navigation */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
