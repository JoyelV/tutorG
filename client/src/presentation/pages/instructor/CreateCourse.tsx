import React, { useState } from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";

const CreateCourse: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="bg-gray-100 p-4">
      <section>
        <BasicInformation />
      </section>
    </div>
  );
};

export default CreateCourse;