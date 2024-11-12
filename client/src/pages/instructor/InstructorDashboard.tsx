import React from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';
import StatsCard from '../../components/instructor/StatsCard';
import ActivityFeed from '../../components/instructor/ActivityFeed';
import RevenueChart from '../../components/instructor/RevenueChart';
import ProfileViewChart from '../../components/instructor/ProfileViewChart';
import CourseRating from '../../components/instructor/CourseRating';

const InstructorDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader />
        <div className="grid grid-cols-4 gap-6 mt-6">
          {/* Add StatsCard components */}
          <StatsCard label="Enrolled Courses" value="957" icon={<div>📘</div>} />
          <StatsCard label="Active Courses" value="19" icon={<div>🎓</div>} />
          {/* Add more stats cards as needed */}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <ActivityFeed />
          <RevenueChart />
          <ProfileViewChart />
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <CourseRating />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

