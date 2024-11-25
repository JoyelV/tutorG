import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import api from "../../../infrastructure/api/api";
import Sidebar from "../admin/Sidebar";
import TopNav from "./TopNav";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  courseFee: number;
  salePrice?: number;
  createdAt: string;
  instructorId: string;
  isApproved: boolean;
}

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/user/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle block/unblock toggle with toast alerts
  const toggleBlockStatus = async (courseId: string, isCurrentlyApproved: boolean) => {
    try {
      // Update status via API
      const response = await api.patch(`/admin/course-status/${courseId}`);
      const updatedCourse = response.data;

      // Update the local state with the new `isApproved` value
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, isApproved: updatedCourse.isApproved }
            : course
        )
      );

      // Show a toast notification for Block/Unblock
      if (updatedCourse.isApproved) {
        toast.success("Course has been Unblocked successfully!");
      } else {
        toast.error("Course has been Blocked successfully!");
      }
    } catch (err) {
      console.error("Error updating block status:", err);
      setError("Failed to update block status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <TopNav />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Course Management</h1>
        <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />
        </div>
        <div className="bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 text-left">Thumbnail</th>
                <th className="p-4 text-left">Course Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Tutor</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Created Date</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id} className="border-t">
                  <td className="p-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-full"
                    />
                  </td>
                  <td className="p-4">{course.title}</td>
                  <td className="p-4">{course.description}</td>
                  <td className="p-4">{course.instructorId || "N/A"}</td>
                  <td className="p-4">{course.courseFee}</td>
                  <td className="p-4">
                    {new Date(course.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleBlockStatus(course._id, course.isApproved)}
                      className={`px-4 py-2 rounded ${
                        course.isApproved ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"
                      } text-white`}
                    >
                      {course.isApproved ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CourseTable;
