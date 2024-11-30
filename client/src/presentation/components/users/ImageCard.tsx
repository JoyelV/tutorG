import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface Course {
  _id: string;
  title: string;
  category: string;
  courseFee: number;
  thumbnail: string;
  rating: number;
  students: number;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "DESIGN":
      return "bg-pink-100 text-pink-600";
    case "FULL STACK WEB DEVELOPMENT":
      return "bg-blue-100 text-blue-600";
    case "DATABASE":
      return "bg-yellow-100 text-yellow-600";
    case "MARKETING":
      return "bg-green-100 text-green-600";
    case "IT & SOFTWARE":
      return "bg-purple-100 text-purple-600";
    case "MUSIC":
      return "bg-teal-100 text-teal-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ImageCard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Fetch courses from the database (API call)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/user/courses');  
        const data = response.data;

        // Assuming data contains an array of courses and category info
        const coursesData = data.map((course: any) => ({
          _id: course._id,
          title: course.title,
          category: course.category,
          subCategory: course.subCategory,
          courseFee: course.courseFee,
          thumbnail: course.thumbnail,
          rating: course.rating,
          students: course.students.length,  
        }));

        setCourses(coursesData);

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`); 
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-gray-100">
      {courses.map((course, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
          onClick={() => handleCardClick(course._id)}  // Pass course _id to navigate
        >
          <div
            className="h-48 bg-cover bg-center rounded-t-2xl"
            style={{ backgroundImage: `url(${course.thumbnail})` }}
          ></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`${getCategoryColor(course.category)} px-2 py-1 rounded-full text-xs font-semibold uppercase`}>
                {course.category}
              </div>
              <div className="font-bold text-xl text-green-500">
                ₹{course.courseFee}
              </div>
            </div>
            {/* Displaying course title */}
            <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
              {course.title}
            </h2>
            <div className="flex items-center justify-between mb-3">
              <div><span className="text-yellow-500 font-semibold mr-1"> ★ {course.rating}</span></div>
              <div><span className="text-right text-gray-500 font-semibold">{course.students} students</span></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCard;
