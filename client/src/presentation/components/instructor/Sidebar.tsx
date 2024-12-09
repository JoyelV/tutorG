import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const navigate = useNavigate();

  const linkClasses =
    "flex items-center py-2 px-4 rounded transition-colors duration-300";
  const activeLinkClasses = "bg-orange-500";

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/instructor");
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
        <nav className="flex-1">
          <ul>
            <li className="my-2">
              <a
                href="/instructor/instructor-dashboard"
                className="block py-2 px-4 rounded bg-orange-500"
              >
                Dashboard
              </a>
            </li>
            <li className="my-2">
              <a
                href="/instructor/instructor-createCourse"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Create Course
              </a>
            </li>
            <li className="my-2">
              <a
                href="/instructor/my-courses"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                My Courses
              </a>
            </li>
            <li className="my-2">
              <a href="/instructor/my-students" className="block py-2 px-4 hover:bg-gray-700">
                My Students
              </a>
            </li>
            <li className="my-2">
              <a href="#" className="block py-2 px-4 hover:bg-gray-700">
                My Earnings
              </a>
            </li>
            <li className="my-2">
              <a href="#qa" className="block py-2 px-4 hover:bg-gray-700">
                Messages
              </a>
            </li>
            <li className="my-2">
              <a
                href="/instructor/instructor-profile"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Settings
              </a>
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
