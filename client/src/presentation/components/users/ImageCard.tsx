import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import api from '../../../infrastructure/api/api';

interface Course {
  _id: string;
  title: string;
  category: string;
  courseFee: number;
  thumbnail: string;
  averageRating: number;
  students: string;
}

interface ImageCardProps {
  searchTerm: string;
  selectedFilter: string;
  sortOption: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  searchTerm,
  selectedFilter,
  sortOption,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const coursesPerPage = 10;

  const fetchCourses = async () => {
    try {
      const response = await api.get('/user/courses', {
        params: {
          page: currentPage,
          limit: coursesPerPage,
          searchTerm,
          filter: selectedFilter !== 'All Courses' ? selectedFilter : undefined,
          sortOption,
        },
      });
      setCourses(response.data.courses);
      setTotalPages(Math.ceil(response.data.total / coursesPerPage));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedFilter, sortOption]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  return (
    <div className="w-full">
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 bg-gradient-to-br from-white to-white">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => handleCardClick(course._id)}
          >
            {/* Thumbnail */}
            <div
              className="h-48 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            ></div>

            {/* Content */}
            <div className="p-4">
              {/* Category and Fee */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {course.category}
                </span>
                <span className="text-lg font-semibold text-green-600">₹{course.courseFee}</span>
              </div>

              {/* Title */}
              <h2 className="text-base font-medium text-gray-800 leading-tight mb-2">
                {course.title}
              </h2>

              {/* Rating and Students */}
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {course.averageRating}
                </div>
                <div>
                  <span className="text-purple-500 font-medium mr-1">👥</span>
                  {course.students.length} students
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 w-full">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default ImageCard;
