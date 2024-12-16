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
  createdAt: string;
}

interface Category {
  name: string;
  colorClass: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const coursesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          api.get('/user/courses'),
          api.get('/admin/categories'),
        ]);

        setCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
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

  // Filter, Search, and Sort Logic
  const filteredCourses = courses
    .filter((course) =>
      selectedFilter === 'All Courses'
        ? true
        : course.category.toLowerCase() === selectedFilter.toLowerCase()
    )
    .filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'Price: Low to High':
          return a.courseFee - b.courseFee;
        case 'Price: High to Low':
          return b.courseFee - a.courseFee;
        case 'Latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Popular':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  return (
    <div className="w-full">
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-white">
        {displayedCourses.map((course) => (
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
                  className={`${getCategoryColor(course.category)} px-2 py-1 rounded-full text-xs font-semibold uppercase`}
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
