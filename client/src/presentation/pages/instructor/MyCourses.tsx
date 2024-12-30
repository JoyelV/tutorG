import React, { useState, useEffect } from "react";
import Sidebar from "../../components/instructor/Sidebar";
import CourseCard from "../../components/instructor/CourseCard";
import api from "../../../infrastructure/api/api";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/instructor/DashboardHeader";

interface Course {
  _id: string;
  title: string;
  category: string;
  courseFee: number;
  rating: number;
  students: number;
  thumbnail: string;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit] = useState<number>(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/instructor/courses`, {
          params: { page: currentPage, limit },
        });
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [currentPage, limit]);

  const handleEdit = (courseId: string) => {
    navigate(`/instructor/course-edit/${courseId}`);
  };

  const handleDelete = async (courseId: string) => {
    try {
      await api.delete(`/instructor/delete-course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
      navigate("/instructor/my-courses");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleView = (courseId: string) => {
    navigate(`/instructor/course-view/${courseId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-50 bg-gray-100">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800">
          <DashboardHeader />
        </div>

        {/* Content below the fixed header */}
        <div className="pt-24 px-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            My Courses
          </h2>
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEdit={() => handleEdit(course._id)}
                  onDelete={() => handleDelete(course._id)}
                  onView={() => handleView(course._id)}
                />
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              className={`px-4 py-2 rounded-full shadow-md transition duration-300 ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </span>
            </button>

            <span className="text-lg font-semibold text-gray-700">
              Page <span className="text-blue-600">{currentPage}</span> of{" "}
              <span className="text-blue-600">{totalPages}</span>
            </span>

            <button
              className={`px-4 py-2 rounded-full shadow-md transition duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="flex items-center">
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
