import { useEffect, useState } from 'react';
import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface SummaryData {
  totalEnrolled: number;
  totalCompleted: number;
  totalOngoing: number;
  uniqueTutors: number;
  ongoingCourses: Course[];
  enrolledCourses: Course[];
  completedCourses: string[];
}

interface Course {
  courseId: {
    _id: string;
    thumbnail: string;
    title: string;
    level: string;
  };
  _id: string;
  progressPercentage?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('username') || 'User';
  const userId = localStorage.getItem('userId');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudentSummary = async () => {
      try {
        const response = await api.get('/user/dashboard-courseData');
        console.log('Backend Response:', response.data);
        setSummary(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student summary:', error);
        setLoading(false);
      }
    };

    fetchStudentSummary();
  }, [userId]);

  return (
    <>
      <div className="flex flex-wrap justify-center items-center bg-white px-4">
        {summary && (
          <>
            {[
              {
                title: 'Enrolled Courses',
                count: summary.totalEnrolled,
                bgColor: '#e8f5e9',
                icon: assets.Business_icon,
              },
              {
                title: 'Completed Courses',
                count: summary.totalCompleted,
                bgColor: '#e3f2fd',
                icon: assets.Music_icon,
              },
              {
                title: 'Unique Tutors',
                count: summary.uniqueTutors,
                bgColor: '#fce4ec',
                icon: assets.Personal_Development_icon,
              },
              {
                title: 'Ongoing Courses',
                count: summary.totalOngoing,
                bgColor: '#fff3e0',
                icon: assets.Personal_Development_icon,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 m-2"
                style={{
                  backgroundColor: item.bgColor,
                  width: '170px',
                  height: '120px',
                }}
              >
                <img src={item.icon} alt={`${item.title} Icon`} className="w-12 h-12" />
                <div className="text-center sm:text-left ml-2">
                  <p className="text-gray-900 font-semibold text-lg">{item.count}</p>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-8 w-full text-3xl font-bold text-black text-center">
        Let’s start learning, {name}
      </div>

      {/* Ongoing Courses Section */}
      <div className="mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Ongoing Courses</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : summary?.ongoingCourses?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {summary.ongoingCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/enrolled-singlecourse/${course.courseId?._id}`)}
              >
                <div
                  className="h-40 bg-cover bg-center rounded-t-lg"
                  style={{ backgroundImage: `url(${course.courseId?.thumbnail})` }}
                ></div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{course.courseId?.title}</h3>
                  <p className="text-sm text-gray-600">{course.courseId?.level}</p>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-2 rounded bg-blue-200">
                        <div
                          style={{ width: `${course.progressPercentage || 0}%` }}
                          className="h-full bg-blue-500"
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Progress: {course.progressPercentage?.toFixed(1) || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No ongoing courses.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
