import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dashboard, School, Group, QuestionAnswer, AccountCircle, ExitToApp } from '@mui/icons-material';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const baseLinkClasses = "flex items-center py-2 px-4 rounded transition-colors duration-300";
    const activeLinkClasses = "bg-orange-500";

    // Logout handler function
    const handleLogout = async () => {
        try {
            localStorage.clear();
            navigate('/admin');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <aside className="bg-gray-800 text-white w-64 h-screen flex flex-col shadow-lg">
            {/* Sidebar Header */}
            <div className="p-5 text-2xl font-bold border-b border-gray-700">
                TutorG
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 mt-4">
                <ul className="space-y-2">
                    <li>
                        <NavLink 
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                            }
                        >
                            <Dashboard fontSize="small" className="mr-3" />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/admin/category"
                            className={({ isActive }) =>
                                `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                            }
                        >
                            <Dashboard fontSize="small" className="mr-3" />
                            Category
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="#courses"
                            className={`${baseLinkClasses} hover:bg-gray-700`}
                        >
                            <School fontSize="small" className="mr-3" />
                            Courses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/admin/users"
                            className={({ isActive }) =>
                                `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                            }
                        >
                            <Group fontSize="small" className="mr-3" />
                            Users/Tutors
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="#qa"
                            className={`${baseLinkClasses} hover:bg-gray-700`}
                        >
                            <QuestionAnswer fontSize="small" className="mr-3" />
                            QA Team
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/admin/adminProfile"
                            className={({ isActive }) =>
                                `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                            }
                        >
                            <AccountCircle fontSize="small" className="mr-3" />
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <button 
                            onClick={handleLogout} 
                            className={`${baseLinkClasses} hover:bg-gray-700 w-full text-left`}
                        >
                            <ExitToApp fontSize="small" className="mr-3" />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
