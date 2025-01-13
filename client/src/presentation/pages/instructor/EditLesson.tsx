import React, { useState } from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import DashboardHeader from '../../components/instructor/DashboardHeader';
import EditLessonPage from './EditLessonPage';

const AddLesson: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
    </aside>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <DashboardHeader toggleSidebar={toggleSidebar} />
        <section>
            <EditLessonPage
            />
        </section>
      </div>
    </div>
  );
};

export default AddLesson;
