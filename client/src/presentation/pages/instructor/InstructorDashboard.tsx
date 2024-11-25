import React from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';
import StatsCard from '../../components/instructor/StatsCard';
import ActivityFeed from '../../components/instructor/ActivityFeed';
import RevenueChart from '../../components/instructor/RevenueChart';
import ProfileViewChart from '../../components/instructor/ProfileViewChart';

const InstructorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
    </aside>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader />
        <div className="grid grid-cols-4 gap-6 mt-6">
          <StatsCard label="Enrolled Courses" value="957" icon={<div>📘</div>} />
          <StatsCard label="Active Courses" value="19" icon={<div>🎓</div>} />
          <StatsCard label="Active Students" value="29" icon={<div>📘</div>} />
          <StatsCard label="Total Earnings" value="32" icon={<div>🎓</div>} />
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <ActivityFeed />
          <RevenueChart />
          <ProfileViewChart />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

