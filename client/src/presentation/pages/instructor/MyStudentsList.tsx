import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import api from "../../../infrastructure/api/api";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import { CircularProgress } from "@mui/material";

interface Student {
  _id: string;
  studentId: {
    username: string;
    email: string;
    phone: string;
    image: string;
    gender: string;
  };
  courseId: {
    title: string;
    level: string;
  };
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [filterCourseLevel, setFilterCourseLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchStudents = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/instructor/students`, {
        params: { page, limit: 4 },
      });
      const { students, totalPages } = response.data;
      setStudents(students);
      setFilteredStudents(students);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filterAndSearch = () => {
      let updatedList = students;

      if (filterCourseLevel) {
        updatedList = updatedList.filter((student) =>
          student.courseId.level.toLowerCase() === filterCourseLevel.toLowerCase()
        );
      }

      if (searchQuery) {
        updatedList = updatedList.filter(
          (student) =>
            student.studentId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.courseId.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredStudents(updatedList);
    };

    filterAndSearch();
  }, [searchQuery, filterCourseLevel, students]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white flex flex-col ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 pt-24">
        {/* Fixed Dashboard Header */}
        <div className="fixed w-full top-0 left-0 z-10 bg-white shadow-md">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>

        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Students List</h2>

          {/* Filters and Search */}
          <div className="mb-4 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by Name or Course Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
            />
            <select
              value={filterCourseLevel}
              onChange={(e) => setFilterCourseLevel(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Loading Spinner */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <div>
              {/* Students Table */}
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Image</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Username</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Gender</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Course Title</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Course Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="px-4 py-4">
                          <img
                            src={student.studentId.image}
                            alt={student.studentId.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-4 py-4 text-gray-700">{student.studentId.username}</td>
                        <td className="px-4 py-4 text-gray-700">{student.studentId.email}</td>
                        <td className="px-4 py-4 text-gray-700">{student.studentId.phone}</td>
                        <td className="px-4 py-4 text-gray-700">{student.studentId.gender}</td>
                        <td className="px-4 py-4 text-gray-700">{student.courseId.title}</td>
                        <td className="px-4 py-4 text-gray-700">{student.courseId.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;