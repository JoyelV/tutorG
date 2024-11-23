import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const linkClasses = "flex items-center py-2 px-4 rounded transition-colors duration-300";
    const activeLinkClasses = "bg-orange-500";

    const handleLogout = async () => {
        try {
            localStorage.clear();
            navigate('/instructor');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <aside className="bg-gray-800 text-white w-64 h-screen flex flex-col">
            <div className="p-5 text-2xl font-bold">TutorG</div>
            <nav className="flex-1">
                <ul>
                    <li className="my-2">
                        <a href="/instructor/instructor-dashboard" className="block py-2 px-4 rounded bg-orange-500">Dashboard</a>
                    </li>
                    <li className="my-2">
                        <a href="/instructor/instructor-createCourse" className="block py-2 px-4 hover:bg-gray-700">Create Course</a>
                    </li>
                    <li className="my-2">
                        <a href="#courses" className="block py-2 px-4 hover:bg-gray-700">My Courses</a>
                    </li>
                    <li className="my-2">
                        <a href="#" className="block py-2 px-4 hover:bg-gray-700">My Earnings</a>
                    </li>
                    <li className="my-2">
                        <a href="#qa" className="block py-2 px-4 hover:bg-gray-700">Messages</a>
                    </li>
                    <li className="my-2">
                        <a href="/instructor/instructor-profile" className="block py-2 px-4 hover:bg-gray-700">Settings</a>
                    </li>
                    <li className="my-2">
                        <button 
                            onClick={handleLogout} 
                            className={`${linkClasses} hover:bg-gray-700 w-full text-left`}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
