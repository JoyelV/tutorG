import { useState, useEffect } from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';
import StatsCard from '../../components/instructor/StatsCard';
import ActivityFeed from '../../components/instructor/ActivityFeed';
import api from '../../../infrastructure/api/api';
import EarningsVsCoursesChart from '../../components/instructor/RevenueChart';
import EnrolledVsCoursesChart from '../../components/instructor/EnrolledVsCoursesChart';

const InstructorDashboard = () => {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    myCourses: 0,
    myStudents: 0,
    myEarnings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesResponse = await api.get('/instructor/coursesCount');
        const myCoursesResponse = await api.get('/instructor/my-courses/coursesCount');
        const studentsResponse = await api.get('/instructor/studentsCount');
        const earningsResponse = await api.get('/instructor/earningsCount');

        setStats({
          enrolledCourses: coursesResponse.data.count,
          myCourses: myCoursesResponse.data.count,
          myStudents: studentsResponse.data.count,
          myEarnings: Math.floor(earningsResponse.data.totalEarnings),
        });
      } catch (error) {
        console.error('Error fetching instructor stats:', error);
      }
    };

    fetchStats();
  }, []);

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
            <StatsCard label="Approved Courses" value={stats.enrolledCourses} icon={<div>📘</div>} />
            <StatsCard label="My Total Courses" value={stats.myCourses} icon={<div>🎓</div>} />
            <StatsCard label="My Students" value={stats.myStudents} icon={<div>📘</div>} />
            <StatsCard label="My Earnings" value={stats.myEarnings} icon={<div>🎓</div>} />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <ActivityFeed />
            <EarningsVsCoursesChart />
            <EnrolledVsCoursesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
