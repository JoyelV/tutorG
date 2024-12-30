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
  rating: number;
  level: string;
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
  const coursesPerPage = 5;

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
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-white">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleCardClick(course._id)}
          >
            <div
              className="h-48 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            ></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`${course.category} px-2 py-1 rounded-full text-xs font-semibold uppercase`}
                >
                  {course.category}
                </div>
                <div className="font-bold text-xl text-green-500">₹{course.courseFee}</div>
              </div>
              <h2 className="text-start px-2 py-1 text-sm font-semibold text-gray-800 leading-tight">
                {course.title}
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-yellow-500 font-semibold">★ {course.rating}</div>
                <div className="text-gray-500">{course.level} Level</div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
