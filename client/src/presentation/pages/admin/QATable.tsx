import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import api from "../../../infrastructure/api/api";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";

const QATeamTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState("QA Specialist");
  const [searchQuery, setSearchQuery] = useState("");
  const [qaData, setQaData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "QA Specialist") {
      fetchQAData();
    } else if (activeTab === "Requests") {
      fetchCourses();
    }
  }, [activeTab]);

  const fetchQAData = () => {
    setLoading(true);
    api
      .get("/admin/qa")
      .then((response) => {
        setQaData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching QA data:", error);
        setLoading(false);
      });
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/courseData");
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses");
      setLoading(false);
    }
  };

  const handleToggleDelete = (id: string, isDeleted: boolean) => {
    const updatedStatus = !isDeleted;
    api
      .put(`/admin/qa/${id}`, { isDeleted: updatedStatus })
      .then(() => {
        toast.success(
          `QA Specialist has been ${updatedStatus ? "blocked" : "unblocked"} successfully`
        );
        fetchQAData();
      })
      .catch((error) => {
        toast.error("Error updating QA Specialist status");
        console.error("Error updating QA Specialist status:", error);
      });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddQASpecialistClick = () => {
    navigate("/admin/add-qa");
  };

  const handleUpdate = (id: string) => {
    navigate(`/admin/update-qa/${id}`);
  };

  const filteredData = qaData.filter((item: any) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePublishCourse = async (courseId: string) => {
    try {
      await api.put(`/admin/publish/${courseId}`);
      toast.success("Course published successfully!");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to publish course");
      console.error("Error publishing course:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation */}
        <TopNav />

        {/* Main Body Content */}
        <div className="pt-16 p-6 overflow-y-auto h-full">
          {/* Toast Container */}
          <ToastContainer />

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email, or manager..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            {["QA Specialist", "Requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-blue-500 ${
                  activeTab === tab ? "border-b-2 border-blue-500" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Content */}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div>
              {activeTab === "QA Specialist" && (
                <div className="overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">QA Team</h1>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={handleAddQASpecialistClick}
                    >
                      Add
                    </button>
                  </div>
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">Qualification</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item: any, index: number) => (
                          <tr
                            key={item._id}
                            className={`${
                              index % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
                            }`}
                          >
                            <td className="border border-gray-300 px-4 py-2">
                              {item.qaname}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.email_id}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.role}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.qualification}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 flex gap-2">
                              <button
                                className={`px-4 py-1 rounded-md ${
                                  item.isDeleted
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                                onClick={() => handleToggleDelete(item._id, item.isDeleted)}
                              >
                                {item.isDeleted ? "Unblock" : "Blocked"}
                              </button>
                              <button
                                className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600"
                                onClick={() => handleUpdate(item._id)}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center text-gray-500 py-4"
                          >
                            No results found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "Requests" && (
                 <div className="overflow-x-auto">
                 {/* Courses Table */}
                 <table className="table-auto w-full border-collapse border border-gray-300">
                   <thead>
                     <tr className="bg-blue-100">
                       <th className="border border-gray-300 px-4 py-2">Thumbnail</th>
                       <th className="border border-gray-300 px-4 py-2">Title</th>
                       <th className="border border-gray-300 px-4 py-2">Category</th>
                       <th className="border border-gray-300 px-4 py-2">Status</th>
                       <th className="border border-gray-300 px-4 py-2">Submitted on</th>
                       <th className="border border-gray-300 px-4 py-2">Action</th>
                       <th className="border border-gray-300 px-4 py-2">View</th>
                     </tr>
                   </thead>
                   <tbody>
                     {courses.length > 0 ? (
                       courses.map((course: any) => (
                         <tr key={course._id} className="border-t">
                           <td className="p-4">
                             <img
                               src={course.thumbnail}
                               alt={course.title}
                               className="w-16 h-16 rounded-full"
                             />
                           </td>
                           <td className="p-4">{course.title}</td>
                           <td className="p-4">{course.category}</td>
                           <td className="p-4">{course.status}</td>
                           <td className="p-4">
                             {new Date(course.createdAt).toLocaleDateString()}
                           </td>
                           <td className="p-4">
                              {course.status !== "Published" && (
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                  onClick={() => handlePublishCourse(course._id)}
                                >
                                  Publish
                                </button>
                              )}
                              
                            </td>
                            <td className="p-4">

                            {/* View Button */}
                    <button
                      onClick={() => navigate(`/admin/viewCoursePage/${course._id}`)}
                      className="px-4 py-2 bg-green-500 hover:bg-blue-700 text-white rounded"
                    >
                      View
                    </button>
                    </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={6} className="text-center py-4">
                           No courses found
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QATeamTable;
