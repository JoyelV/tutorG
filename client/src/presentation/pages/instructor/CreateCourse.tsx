import React, { useState } from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";
import AdvanceInformation from "../../pages/instructor/AdvanceInfo";
import CurriculumPublish from "../../pages/instructor/CurriculumPublish";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

const CreateCourse: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("basic");
  const [basicInfo, setBasicInfo] = useState<{
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    language: string;
    level: string;
    duration: number;
  } | null>(null); // Store data from BasicInformation

  return (
    <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <DashboardHeader />
    <section>
      {currentTab === "basic" && (
        <BasicInformation
          setTab={(tab: string) => setCurrentTab(tab)}
          setBasicInfo={(info) => setBasicInfo(info)} // Update basicInfo state
        />
      )}
      {currentTab === "advance" && basicInfo && (
        <AdvanceInformation
          setTab={(tab: string) => setCurrentTab(tab)}
          basicInfo={basicInfo} // Pass basicInfo to AdvanceInformation
        />
      )}
      {currentTab === "publish" && <CurriculumPublish />}
    </section>
    </div>
    </div>
  );
};

export default CreateCourse;
