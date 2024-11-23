import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import UserTable from './UserTable';
import TutorsTable from '../../pages/admin/TutorsTable';

const UsersPage: React.FC = () => {
  const [isShowingStudents, setIsShowingStudents] = useState(true);

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
      <TopNav/>
        {/* Main Body Content */}
        <div className="pt-16 p-6 overflow-y-auto h-full">
          <div>
            <h1 className="text-2xl font-bold mb-4">USERS</h1>
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setIsShowingStudents(true)}
              className={`text-blue-500 ${isShowingStudents ? 'border-b-2 border-blue-500' : ''}`}
            >
              Students
            </button>
            <button
              onClick={() => setIsShowingStudents(false)}
              className={`text-blue-500 ${!isShowingStudents ? 'border-b-2 border-blue-500' : ''}`}
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
