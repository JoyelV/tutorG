import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../infrastructure/api/api";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";

const QATeamTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState("QA Specialist");
  const [searchQuery, setSearchQuery] = useState("");
  const [qaData, setQaData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

useEffect(() => {
  api
    .get('/admin/qa')
    .then((response) => {
      setQaData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching QA data:", error);
      setLoading(false);
    });
}, []);

  const filteredData = qaData.filter((item: any) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );  

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    navigate("/admin/add-qaLead");
  };

  const handleAddQASpecialistClick = () => {
    navigate("/admin/add-qaSpecialist");
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
            {["QA Specialist", "QA Lead", "Requests"].map((tab) => (
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
                    <h1 className="text-2xl font-bold">QA Specialist</h1>
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
                        <th className="border border-gray-300 px-4 py-2">Id</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">
                          Qualification
                        </th>
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
                              {item._id}
                            </td>
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
                              <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600">
                                Delete
                              </button>
                              <button className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600">
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

              {activeTab === "QA Lead" && (
                <div>
                  <p>QA Lead data goes here</p>
                </div>
              )}

              {activeTab === "Requests" && (
                <div>
                  <p>Requests data goes here</p>
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
