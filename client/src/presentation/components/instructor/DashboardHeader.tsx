import React from 'react';
import { assets } from '../../../assets/assets_user/assets';

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div>
        <h1 className="text-xl font-bold">My Profile</h1>
        <p>Good Morning</p>
      </div>
      <div className="flex items-center space-x-4">
      <span className="text-gray-600">Hello, Instructor</span>
        <img src={assets.Instructor4} alt="Profile" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

export default DashboardHeader;
