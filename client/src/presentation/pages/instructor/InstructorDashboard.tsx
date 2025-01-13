import { useState, useEffect } from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';
import StatsCard from '../../components/instructor/StatsCard';
import api from '../../../infrastructure/api/api';
import EarningsVsCoursesChart from '../../components/instructor/RevenueChart';
import EnrolledVsCoursesChart from '../../components/instructor/EnrolledVsCoursesChart';
import { useAuth } from '../../../infrastructure/context/AuthContext';
import { Navigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { auth } = useAuth();

  const [stats, setStats] = useState({
    enrolledCourses: 0,
    myCourses: 0,
    myStudents: 0,
    myEarnings: 0,
  });

  if (!auth || auth.role !== 'instructor') {
    return <Navigate to="/instructor" />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesResponse, myCoursesResponse, studentsResponse, earningsResponse] = await Promise.all([
          api.get('/instructor/coursesCount'),
          api.get('/instructor/my-courses/coursesCount'),
          api.get('/instructor/studentsCount'),
          api.get('/instructor/earningsCount'),
        ]);

        setStats({
          enrolledCourses: coursesResponse.data.count || 0,
          myCourses: myCoursesResponse.data.count || 0,
          myStudents: studentsResponse.data.count || 0,
          myEarnings: Math.floor(earningsResponse.data.totalEarnings || 0),
        });
      } catch (error) {
        console.error('Error fetching instructor stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 bg-gray-800 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800 z-10">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>

        {/* Content below the header */}
        <div className="mt-16 p-4 md:mt-24">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatsCard label="Approved Courses" value={stats.enrolledCourses} icon={<div>📘</div>} />
            <StatsCard label="My Total Courses" value={stats.myCourses} icon={<div>🎓</div>} />
            <StatsCard label="My Students" value={stats.myStudents} icon={<div>📘</div>} />
            <StatsCard label="My Earnings" value={stats.myEarnings} icon={<div>🎓</div>} />
          </div>

          {/* Charts and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Section: Chart 1 */}
            <div className="flex flex-col">
              <EarningsVsCoursesChart />
            </div>
            {/* Right Section: Chart 2 */}
            <div className="flex flex-col">
              <EnrolledVsCoursesChart />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default InstructorDashboard;