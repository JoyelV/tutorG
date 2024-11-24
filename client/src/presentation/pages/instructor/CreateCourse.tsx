import React from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

const CreateCourse: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader />
        <section>
            <BasicInformation
            />
        </section>
      </div>
    </div>
  );
};

export default CreateCourse;
