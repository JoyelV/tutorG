import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../infrastructure/api/api";

function EnrolledCourseData() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 8;

  const totalPages = Math.ceil(enrolledCourses.length / dataPerPage);
  const paginatedData = enrolledCourses.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get(`/user/orders`);
      setEnrolledCourses(response.data || []);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to fetch enrolled courses.";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (userId) fetchEnrolledCourses();
  }, [userId]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/enrolled-singlecourse/${courseId}`);
  };

  return (
    <div className="px-6">
      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {paginatedData.map((course) => (
          <div
            key={course._id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <button
              onClick={() => handleCourseClick(course.courseId._id)}
              className="w-full"
            >
              {course.courseId?.thumbnail ? (
                <img
                  src={course.courseId.thumbnail}
                  alt={course.courseId.title}
                  className="w-full h-40 rounded-t-lg object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
                  <span>No Image</span>
                </div>
              )}
            </button>

            <div className="p-4">
              <button
                onClick={() => handleCourseClick(course.courseId._id)}
                className="text-left w-full"
              >
                <h5 className="text-lg font-semibold text-sky-700">
                  {course.courseId?.title || "No Course Name"}
                </h5>
              </button>
              <p className="text-sky-600 text-base font-medium mt-2">
                ₹{course.courseId?.courseFee || "N/A"}
              </p>
              <p className="text-sm text-yellow-500 mb-4">
                {course.courseId?.level || "No Level"} Level
              </p>
              <button
                onClick={() => handleCourseClick(course.courseId._id)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition"
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="https://via.placeholder.com/150"
            alt="No Courses Illustration"
            className="w-40 h-40 mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Oops! No Courses Found
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-center">
            You haven't enrolled in any courses yet. Explore our catalog and start learning today!
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            onClick={() => navigate('/course-listing')}
          >
            Browse Courses
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <ul className="flex space-x-2">
            <li
              onClick={() => handlePageChange(currentPage - 1)}
              className={`cursor-pointer px-3 py-1 rounded-md ${currentPage === 1
                  ? "text-gray-400 pointer-events-none"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              Prev
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`cursor-pointer px-3 py-1 rounded-md ${currentPage === index + 1
                    ? "bg-sky-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {index + 1}
              </li>
            ))}
            <li
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer px-3 py-1 rounded-md ${currentPage === totalPages
                  ? "text-gray-400 pointer-events-none"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              Next
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default EnrolledCourseData;