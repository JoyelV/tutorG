import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
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
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage !== totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Fetch orders and courses from backend
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get(`/user/orders`);
        if (response.data && Array.isArray(response.data)) {
          setEnrolledCourses(response.data); 
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
        <div className="text-center py-8">
          <span className="text-xl text-gray-700">No courses available.</span>
        </div>
      )}
      <div className="mt-28">
        <ul className="flex space-x-3 justify-center mt-8">
          <li
            onClick={handlePrev}
            className={`flex items-center justify-center shrink-0 cursor-pointer ${
              currentPage === 1 ? "bg-gray-300" : ""
            } w-9 h-8 rounded`}
          >
            {/* SVG for previous */}
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
              currentPage === totalPages ? "bg-gray-300" : ""
            } w-9 h-8 rounded`}
          >
            {/* SVG for next */}
          </li>
        </ul>
      </div>
    </>
  );
}

export default EnrolledCourseData;
