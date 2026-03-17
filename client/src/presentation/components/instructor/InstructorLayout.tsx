import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const InstructorLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed z-20 inset-y-0 left-0 bg-gray-800 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
            >
                <Sidebar />
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* Fixed Dashboard Header */}
                <div className="fixed top-0 left-0 right-0 bg-gray-800 z-10">
                    <DashboardHeader toggleSidebar={toggleSidebar} />
                </div>

                {/* Content below the header */}
                <div className="mt-16 p-4 md:mt-24 overflow-y-auto">
                    <Outlet />
                </div>
            </div>

            {/* Overlay for sidebar on mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default InstructorLayout;
