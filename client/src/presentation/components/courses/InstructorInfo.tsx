import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';

interface InstructorInfoProps {
  instructorId: string; 
}

interface Instructor {
  username: string;
  email:string;
  role: string;
  image: string;
}

const InstructorInfo: React.FC<InstructorInfoProps> = ({ instructorId }) => {
  const [instructorData, setInstructorData] = useState<Instructor | null>(null);
  const url = 'http://localhost:5000';
  useEffect(() => {
    const fetchInstructorData = async () => {
      const response = await api.get(`/instructor/profile/${instructorId}`)
      setInstructorData(response.data);
    };

    fetchInstructorData();
  }, [instructorId]);

  if (!instructorData) {
    return <p>Loading instructor information...</p>;
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Course Instructor</h2>
      <div className="flex items-center mt-4">
        <img
          src={`${url}/${instructorData.image}`}
          alt={instructorData.username}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{instructorData.username}</h3>
          <p className="text-gray-600">{instructorData.email}</p>
          <p className="text-gray-600">{instructorData.role}</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorInfo;
