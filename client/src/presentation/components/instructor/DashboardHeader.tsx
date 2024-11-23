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
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg p-2"
        />
        <img src={assets.Instructor3} alt="Profile" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

export default DashboardHeader;
