import React, { useEffect, useState } from "react";
import Sidebar from "../admin/Sidebar";
import TopNav from "./TopNav";
import api from "../../../infrastructure/api/api";
import { CircularProgress, Box, Typography, TextField, Pagination } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  courseFee: number;
  salePrice?: number;
  status: string;
  category: string;
  isApproved: boolean;
}

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/courseData", {
          params: {
            page: currentPage,
            limit: coursesPerPage,
          },
        });
        const data = response.data;
        setCourses(data.courses);
        setFilteredCourses(data.courses); 
        setTotalPages(data.totalPages); 
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]); 

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.status.toLowerCase().includes(query)
    );

    setFilteredCourses(filtered);
    setCurrentPage(1); 
  };

  const toggleBlockStatus = async (courseId: string, isCurrentlyApproved: boolean) => {
    try {
      const result = await Swal.fire({
        title: "Block/Unblock Course?",
        text: "Are you sure you want to block/unblock this course?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Proceed!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await api.patch(`/admin/course-status/${courseId}`);
        const updatedCourse = response.data;
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId
              ? { ...course, isApproved: updatedCourse.isApproved }
              : course
          )
        );
        setFilteredCourses((prevFilteredCourses) =>
          prevFilteredCourses.map((course) =>
            course._id === courseId
              ? { ...course, isApproved: updatedCourse.isApproved }
              : course
          )
        );
        toast.success(
          updatedCourse.isApproved
            ? "Course has been unblocked successfully!"
            : "Course has been blocked successfully!"
        );
      }
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error("Failed to update block status");
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        <TopNav />
        <div className="pt-16 p-6 overflow-y-auto h-full">
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100vh"
              bgcolor="#f9f9f9"
            >
              <CircularProgress color="primary" size={50} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                Loading, please wait...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Search and Table */}
              <div className="pt-10 p-2 overflow-y-auto h-full">
              <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">COURSE MANAGEMENT</h1>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Courses"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thumbnail
                    </th>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="border-t">
                      <td className="px-6 py-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-3">{course.title}</td>
                      <td className="px-6 py-3">{course.category}</td>
                      <td className="px-6 py-3">₹{course.courseFee}</td>
                      <td className="px-6 py-3">{course.status}</td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => toggleBlockStatus(course._id, course.isApproved)}
                          className={`px-4 py-2 rounded ${course.isApproved
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-green-500 hover:bg-green-700"
                            } text-white`}
                        >
                          {course.isApproved ? "Unblock" : "Block-?"}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/viewCoursePage/${course._id}`)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseTable;
