import React from 'react';
import { Link } from 'react-router-dom'; 
import { assets } from '../../../assets/assets_user/assets';

const TopNav: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-white p-4 shadow">
      <input type="text" placeholder="Search" className="border p-2 rounded" />
      <div className="flex items-center">
        <img
          src={assets.Instructor3} 
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default TopNav;

