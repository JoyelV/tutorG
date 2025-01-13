import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../infrastructure/context/AuthContext";
import api from "../../../infrastructure/api/api";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const baseLinkClasses =
    "block py-2 px-4 rounded transition-colors duration-300";
  const activeLinkClasses = "bg-orange-500 text-white";

  const handleLogout = async () => {
    try {
      logout();
      const response = await api.post("/instructor/logout", { withCredentials: true });
      if (response.status === 200) {
        navigate("/instructor");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Hamburger Menu for Small Screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-orange-500 p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white fixed top-0 left-0 h-screen z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 w-64`}
      >
        <div className="p-5 text-2xl font-bold">TutorG</div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li className="my-2">
              <NavLink
                to="/instructor/instructor-dashboard"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/instructor-createCourse"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                Create Course
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/my-courses"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                My Courses
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/my-students"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                My Students
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/my-earnings"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                My Earnings
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/messages"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                Messages
              </NavLink>
            </li>
            <li className="my-2">
              <NavLink
                to="/instructor/instructor-profile"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
                }
              >
                Settings
              </NavLink>
            </li>
            <li className="my-2">
              <button
                onClick={handleLogout}
                className={`${baseLinkClasses} hover:bg-gray-700 w-full text-left`}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
