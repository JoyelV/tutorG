import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import UserTable from './UserTable';
import TutorsTable from '../../pages/admin/TutorsTable';

const UsersPage: React.FC = () => {
  const [isShowingStudents, setIsShowingStudents] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-lg">
    {/* Sidebar */}
      <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
      <TopNav/>
        {/* Main Body Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold mb-4 text-center">USERS & TUTORS MANAGEMENT</h1>
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setIsShowingStudents(true)}
              className={`px-4 py-2 text-blue-500 ${isShowingStudents ? 'border-b-2 border-blue-500' : ''}`}
            >
              Students
            </button>
            <button
              onClick={() => setIsShowingStudents(false)}
              className={`px-4 py-2 text-blue-500 ${!isShowingStudents ? 'border-b-2 border-blue-500' : ''}`}
            >
              Tutors
            </button>
          </div>
          {isShowingStudents ? <UserTable /> : <TutorsTable />}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
