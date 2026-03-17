import { useState, useEffect } from 'react';
import StatsCard from '../../components/instructor/StatsCard';
import { courseService } from '../../../infrastructure/api/courseService';
import ChartComponent from '../../components/instructor/EnrolledVsCoursesChart';
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [publishedRes, totalCoursesRes, studentsRes, earningsRes] = await Promise.all([
          courseService.getPublishedCoursesCount(),
          courseService.getTotalCoursesCount(),
          courseService.getStudentsStats(),
          courseService.getEarningsStats(),
        ]);

        const getCount = (res: any) => res.data.data?.count ?? res.data.count ?? 0;
        const getEarnings = (res: any) => res.data.data?.totalEarnings ?? res.data.totalEarnings ?? 0;

        setStats({
          enrolledCourses: getCount(publishedRes),
          myCourses: getCount(totalCoursesRes),
          myStudents: getCount(studentsRes),
          myEarnings: Math.floor(getEarnings(earningsRes)),
        });
      } catch (error) {
        console.error('Error fetching instructor stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Approved Courses" value={stats.enrolledCourses} icon={<div>📘</div>} />
        <StatsCard label="My Total Courses" value={stats.myCourses} icon={<div>🎓</div>} />
        <StatsCard label="My Students" value={stats.myStudents} icon={<div>📘</div>} />
        <StatsCard label="My Earnings" value={stats.myEarnings} icon={<div>🎓</div>} />
      </div>

      {/* Charts and Activity Feed */}
      <div className="flex flex-col col-span-1 lg:col-span-1 mt-10">
        <ChartComponent />
      </div>
    </div>
  );
};

export default InstructorDashboard;
