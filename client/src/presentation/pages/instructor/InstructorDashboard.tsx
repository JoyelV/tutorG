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

      {/* Main content area */}
      <div className="flex-1 bg-gray-100 ml-50 pt-24"> {/* Adjust margin for sidebar and padding for header */}
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800">
          <DashboardHeader />
        </div>

        {/* Content below the header */}
        <div className="mt-10"> {/* Ensure space below the fixed header */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <StatsCard label="Enrolled Courses" value="9" icon={<div>📘</div>} />
            <StatsCard label="Active Courses" value="19" icon={<div>🎓</div>} />
            <StatsCard label="Active Students" value="29" icon={<div>📘</div>} />
            <StatsCard label="Total Earnings" value="3200" icon={<div>🎓</div>} />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <ActivityFeed />
            <RevenueChart />
            <ProfileViewChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

