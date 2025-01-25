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
      <div className="flex flex-wrap justify-center items-center bg-white px-4 py-8 gap-3">
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
                className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 m-2"
                style={{
                  backgroundColor: item.bgColor,
                  width: '260px',
                  height: '110px',
                }}
              >
                <img src={item.icon} alt={`${item.title} Icon`} className="w-15 h-15" />
                <div className="flex items-center gap-x-1 mt-2">
                  <p className="text-gray-900 font-semibold text-2xl">{item.count}</p>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-8 w-full text-2xl font-bold text-black text-center">
        Let’s start learning, {name}
      </div>

      {/* Ongoing Courses Section */}
      <div className="mt-8 px-4">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
        ) : summary?.ongoingCourses?.length ? (
          <div className="flex gap-6 overflow-x-scroll scrollbar-hide">
            {summary.ongoingCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white min-w-[250px] rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
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
          <>
            <div className="flex items-center justify-center flex-col">
              <p className="text-center text-md font-semibold text-gray-700 p-4">
                🚀 No ongoing courses. Purchase one and start learning!
              </p>
              <button
                onClick={() => (window.location.href = '/course-listing')}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Go to Courses
              </button>
            </div>
          </>
        )}
      </div>

    </>
  );
};

export default Dashboard;
