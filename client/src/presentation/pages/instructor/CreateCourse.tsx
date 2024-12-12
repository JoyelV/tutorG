import React from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

const CreateCourse: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-50 bg-gray-100">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-gray-800">
          <DashboardHeader />
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
