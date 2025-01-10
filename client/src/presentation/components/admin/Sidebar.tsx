import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dashboard, School, Group, AccountCircle, ExitToApp, Menu } from '@mui/icons-material';
import { useAuth } from '../../../infrastructure/context/AuthContext';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const baseLinkClasses = "flex items-center py-2 px-4 rounded transition-colors duration-300";
    const activeLinkClasses = "bg-orange-500";

    const handleLogout = async () => {
        try {
            logout();
            navigate("/admin");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Hamburger Menu */}
            <button
                className="bg-gray-800 text-white p-3 fixed top-4 left-4 z-50 rounded-md md:hidden"
                onClick={toggleSidebar}
            >
                <Menu fontSize="small" />
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-gray-800 text-white w-64 h-screen fixed top-0 z-40 shadow-lg transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="p-5 text-2xl font-bold border-b border-gray-700">
                    TutorG
                </div>

                {/* Navigation Links */}
                <nav className="mt-4">
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
                                to="/admin/courses"
                                className={({ isActive }) =>
                                    `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                                }
                            >
                                <School fontSize="small" className="mr-3" />
                                Courses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) =>
                                    `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-700'}`
                                }
                            >
                                <School fontSize="small" className="mr-3" />
                                Orders
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

            {/* Overlay for Mobile View */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;