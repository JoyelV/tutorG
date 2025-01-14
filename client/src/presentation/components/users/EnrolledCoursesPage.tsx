import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../infrastructure/api/api";

function EnrolledCourseData() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;

  const totalPages = Math.ceil(enrolledCourses.length / dataPerPage);
  const paginatedData = enrolledCourses.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrev = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get(`/user/orders`);
        if (response.data && Array.isArray(response.data)) {
          setEnrolledCourses(response.data);
        } else {
          setEnrolledCourses([]); 
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Failed to fetch enrolled courses");
      }
    };

    if (userId) {
      fetchEnrolledCourses();
    }
  }, [userId]);

  const handleSingleEnrollCourse = (courseId: string) => {
    navigate(`/enrolled-singlecourse/${courseId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mx-10 gap-4">
        {paginatedData.map((course) => (
          <div
            key={course._id}
            className="mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-3/4 mx-auto"
          >
            <button
              onClick={() => handleSingleEnrollCourse(course.courseId._id)}
              className="w-full"
            >
              {course.courseId?.thumbnail ? (
                <img
                  className="rounded-t-lg w-full h-40 object-cover"
                  src={course.courseId.thumbnail}
                  alt={course.courseId.title}
                />
              ) : (
                <div className="rounded-t-lg w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </button>

            <div className="p-5">
              <button
                onClick={() => handleSingleEnrollCourse(course.courseId._id)}
                className="w-full text-left"
              >
                <h5 className="mb-2 text-xl font-bold tracking-tight text-sky-700 dark:text-white">
                  {course.courseId?.title || "No Course Name"}
                </h5>
              </button>
              <h3 className="mb-3 font-normal text-sky-600 dark:text-gray-400">
                ₹{course.courseId?.courseFee || "N/A"}
              </h3>
              <h5 className="mb-2 text-sm tracking-tight text-yellow dark:text-white">
                {course.courseId?.level || "No Level"} Level
              </h5>
              <button
                onClick={() => handleSingleEnrollCourse(course.courseId._id)}
                className="inline-flex items-center px-6 py-1 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-blue-800"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      {enrolledCourses.length === 0 && (
        <>
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2l4-4m5 4.5V6a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 3 6v12a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 19 18.5z"
          ></path>
        </svg>
        <span className="mt-4 text-lg font-semibold text-gray-700">
          No courses available.
        </span>
        <p className="mt-2 text-sm text-gray-500">
          Start learning by enrolling in your first course!
        </p>
        </>
      )}
      <div className="mt-28">
        <ul className="flex space-x-3 justify-center mt-8">
          <li
            onClick={handlePrev}
            className={`flex items-center justify-center shrink-0 cursor-pointer ${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            } w-9 h-8 rounded`}
          >
            Prev
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`flex items-center justify-center shrink-0 cursor-pointer text-sm font-bold ${
                currentPage === i + 1
                  ? "bg-sky-600 text-white"
                  : "text-[#333] bg-gray-300"
              } w-9 h-8 rounded`}
            >
              {i + 1}
            </li>
          ))}
          <li
            onClick={handleNext}
            className={`flex items-center justify-center shrink-0 cursor-pointer ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            } w-9 h-8 rounded`}
          >
            Next
          </li>
        </ul>
      </div>
    </>
  );
}

export default EnrolledCourseData;
