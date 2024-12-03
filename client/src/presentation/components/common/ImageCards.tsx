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

interface Category {
  name: string;
  colorClass: string;
}

const ImageCard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          api.get('/user/courses'),
          api.get('/admin/categories'), 
        ]);

        const coursesData = coursesResponse.data.map((course: any) => ({
          _id: course._id,
          title: course.title,
          category: course.category,
          courseFee: course.courseFee,
          thumbnail: course.thumbnail,
          rating: course.rating,
          students: course.students.length,
        }));

        const categoriesData = categoriesResponse.data.map((category: any) => ({
          name: category.name,
          colorClass: category.colorClass,
        }));

        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (category: string): string => {
    const matchedCategory = categories.find((cat) => cat.name === category);
    return matchedCategory ? matchedCategory.colorClass : 'bg-gray-100 text-gray-600';
  };

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-gray-100">
      {courses.map((course, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
          onClick={() => handleCardClick(course._id)}
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
            <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
              {course.title}
            </h2>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-yellow-500 font-semibold mr-1">★ {course.rating}</span>
              </div>
              <div>
                <span className="text-right text-gray-500 font-semibold">{course.students} students</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCard;
