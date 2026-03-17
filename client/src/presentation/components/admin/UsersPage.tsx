import React, { useState } from 'react';
import UserTable from './UserTable';
import TutorsTable from '../../pages/admin/TutorsTable';

const UsersPage: React.FC = () => {
  const [isShowingStudents, setIsShowingStudents] = useState(true);

  return (
    <div className="bg-gray-100 min-h-full p-4 overflow-y-auto">
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
  );
};

export default UsersPage;
