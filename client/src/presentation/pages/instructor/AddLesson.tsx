import React from 'react';
import Sidebar from '../../components/instructor/Sidebar';
import AddLessonPage from './AddLessonPage';
import DashboardHeader from '../../components/instructor/DashboardHeader';

const AddLesson: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
    </aside>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader />
        <section>
            <AddLessonPage
            />
        </section>
      </div>
    </div>
  );
};

export default AddLesson;
