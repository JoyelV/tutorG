import React from 'react';

type User = {
  name: string;
  email: string;
  headline: string;
  courses: number;
  qualification: string;
};

const users: User[] = Array(8).fill({
  name: 'Jonathan Doe',
  email: 'jonathan@gmail.com',
  headline: 'Web developer, UX/UI Designer, and Teacher',
  courses: 10,
  qualification: 'B.Tech'
});

const UserTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-blue-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Headline', 'Courses', 'Qualification', 'Update','Action'].map((header) => (
              <th key={header} className="p-4 border-b border-blue-300 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="bg-blue-100 even:bg-blue-200">
              <td className="p-4 border-b border-blue-300">{user.name}</td>
              <td className="p-4 border-b border-blue-300">{user.email}</td>
              <td className="p-4 border-b border-blue-300">{user.headline}</td>
              <td className="p-4 border-b border-blue-300">{user.courses}</td>
              <td className="p-4 border-b border-blue-300">{user.qualification}</td>
              <td className="p-4 border-b border-blue-300">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              </td>
              <td className="p-4 border-b border-blue-300">
                <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button className="p-2 border rounded">&lt;</button>
        {[1, 2, 3].map((page) => (
          <button key={page} className="p-2 border rounded">
            {page}
          </button>
        ))}
        <button className="p-2 border rounded">&gt;</button>
      </div>
    </div>
  );
};

export default UserTable;
