import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  category: string;
  courseFee: number;
  thumbnail: string;
  averageRating: number;
  students: string[];
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'DESIGN':
      return 'bg-pink-100 text-pink-600';
    case 'WEB DEVELOPMENT':
      return 'bg-blue-100 text-blue-600';
    case 'DATABASE':
      return 'bg-yellow-100 text-yellow-600';
    case 'MARKETING':
      return 'bg-green-100 text-green-600';
    case 'IT & SOFTWARE':
      return 'bg-purple-100 text-purple-600';
    case 'MUSIC':
      return 'bg-teal-100 text-teal-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const RecentlyAddedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/user/courses/recent'); 
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  return (
    <section className="px-8 py-2 bg-white flex justify-center">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Recently Added Courses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => handleCardClick(course._id)} 
              >
                <div
                  className="h-36 bg-cover bg-center rounded-t-xl"
                  style={{ backgroundImage: `url(${course.thumbnail })` }}
                ></div>
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div
                      className={`${getCategoryColor(course.category)} px-2 py-1 rounded-full text-xs font-semibold uppercase`}
                    >
                      {course.category}
                    </div>
                    <div className="font-bold text-lg text-green-500">₹{course.courseFee}</div>
                  </div>
                  <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                    {course.title}
                  </h2>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div>
                      <span className="text-yellow-500 font-semibold">★ {course.averageRating.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-semibold">
                        {course.students.length} students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAddedCourses;
