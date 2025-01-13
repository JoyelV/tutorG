import React, { useState } from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

const CreateCourse: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white flex flex-col md:block">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 bg-gray-100 md:ml-50">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>

        {/* Content below the fixed header */}
        <div className="pt-24"> {/* Ensure space below the fixed header */}
          <section>
            <BasicInformation />
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;