import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p>Good Morning</p>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg p-2"
        />
        <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

export default DashboardHeader;
