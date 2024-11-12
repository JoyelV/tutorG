import React from 'react';

type Tutor = {
  name: string;
  email: string;
  expertise: string;
  students: number;
  experience: string;
};

const tutors: Tutor[] = Array(8).fill({
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  expertise: 'Math Tutor, Physics Specialist',
  students: 50,
  experience: '5 years',
});

const TutorsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-green-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Expertise', 'Students', 'Experience', 'Update', 'Action'].map((header) => (
              <th key={header} className="p-4 border-b border-green-300 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor, index) => (
            <tr key={index} className="bg-green-100 even:bg-green-200">
              <td className="p-4 border-b border-green-300">{tutor.name}</td>
              <td className="p-4 border-b border-green-300">{tutor.email}</td>
              <td className="p-4 border-b border-green-300">{tutor.expertise}</td>
              <td className="p-4 border-b border-green-300">{tutor.students}</td>
              <td className="p-4 border-b border-green-300">{tutor.experience}</td>
              <td className="p-4 border-b border-green-300">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
              </td>
              <td className="p-4 border-b border-green-300">
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

export default TutorsTable;
