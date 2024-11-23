import React, { useState } from "react";
import BasicInformation from "../../pages/instructor/BasicInfo";
import AdvanceInformation from "../../pages/instructor/AdvanceInfo";
import CurriculumPublish from "../../pages/instructor/CurriculumPublish";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

// Define interfaces for course state
interface BasicInfo {
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language: string;
  level: string;
  duration: number;
}

const CreateCourse: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"basic" | "advance" | "publish">("basic");
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader />
        <section>
          {currentTab === "basic" && (
            <BasicInformation
              setTab={setCurrentTab}
              setBasicInfo={setBasicInfo}
            />
          )}
          {currentTab === "advance" && basicInfo && (
            <AdvanceInformation
              setTab={setCurrentTab}
              basicInfo={basicInfo}
            />
          )}
          {currentTab === "publish" && <CurriculumPublish />}
        </section>
      </div>
    </div>
  );
};

export default CreateCourse;
