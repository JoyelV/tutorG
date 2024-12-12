import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets_user/assets';

const TopNav: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 shadow-md fixed top-0 left-0 right-0 h-16">
      {/* Logo or Branding */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
          AdminPanel
        </Link>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hello, Admin</span>
        <img
          src={assets.Instructor3} 
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-200"
        />
      </div>
    </header>
  );
};

export default TopNav;
