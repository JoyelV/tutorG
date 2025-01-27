import React, { useState, useEffect } from "react";
import Sidebar from "../../components/instructor/Sidebar";
import api from "../../../infrastructure/api/api";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import { CircularProgress } from "@mui/material";

interface Course {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  courseFee: number;
  rating: number;
  thumbnail: string;
  status:string;
}

interface ApiResponse {
  courses: Course[];
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("title");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse>(`/instructor/courses`);
        setCourses(response.data.courses);
        setCategories([
          "All",
          ...Array.from(new Set(response.data.courses.map((course) => course.category))),
        ]);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let updatedCourses = [...courses];

    if (filterCategory !== "All") {
      updatedCourses = updatedCourses.filter(
        (course) => course.category === filterCategory
      );
    }

    if (searchQuery.trim()) {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    updatedCourses.sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "lowFee") return a.courseFee - b.courseFee;
      if (sortOption === "highFee") return b.courseFee - a.courseFee;
      return 0;
    });

    setFilteredCourses(updatedCourses.slice((currentPage - 1) * limit, currentPage * limit));
  }, [courses, filterCategory, sortOption, searchQuery, currentPage, limit]);

  const handleEdit = (courseId: string) => {
    navigate(`/instructor/course-edit/${courseId}`);
  };

  const handleDelete = async (courseId: string) => {
    try {
      await api.delete(`/instructor/delete-course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleView = (courseId: string) => {
    navigate(`/instructor/course-view/${courseId}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i < rating ? "text-gray-400" : "text-yellow-400"}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const totalPages = Math.ceil(
    (filterCategory === "All"
      ? courses.length
      : courses.filter((course) => course.category === filterCategory).length) /
    limit
  );

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      <aside
        className={`w-64 bg-gray-800 text-white flex flex-col fixed z-20 sm:static transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 transition-transform duration-300`}
      >
        <Sidebar />
      </aside>

      <div className="flex-1 bg-gray-100">
        <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800 sm:hidden">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>

        <div className="pt-24 px-4 sm:px-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Courses</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <div>
                  <label htmlFor="filter" className="block sm:inline-block mr-2 font-medium text-gray-700">
                    Filter by
                  </label>
                  <select
                    id="filter"
                    className="border rounded-md px-3 py-2 w-full sm:w-auto"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sort" className="block sm:inline-block mr-2 font-medium text-gray-700">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    className="border rounded-md px-3 py-2 w-full sm:w-auto"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                    <option value="lowFee">Low to High</option>
                    <option value="highFee">High to Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="search" className="block sm:inline-block mr-2 font-medium text-gray-700">
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    className="border rounded-md px-3 py-2 w-full sm:w-auto"
                    placeholder="Search by title or subtitle"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ul className="space-y-4">
                {filteredCourses.map((course) => (
                  <li
                    key={course._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md shadow-sm bg-white"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-20 rounded-md mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="font-semibold text-sm">{course.subtitle}</p>
                        <p className="text-sm text-gray-600">{course.category}</p>
                        <div className="flex items-center">
                          {renderStars(course.rating)}
                        </div>
                        <p className="text-sm text-gray-600">Fee: {course.courseFee}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => handleView(course._id)}
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                        onClick={() => handleEdit(course._id)}
                      >
                        Edit
                      </button>
                      {course.status !== "published" && (
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-md"
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center items-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-md ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
