import React from "react";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-4 text-white bg-gray-800">
      <button
        className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <h1 className="text-lg font-semibold">INSTRUCTOR</h1>
    </header>
  );
};

export default DashboardHeader;