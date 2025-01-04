import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import BaseUrl from '../../../Constants/BaseUrl';

interface InstructorInfoProps {
  instructorId: string;
}

interface Instructor {
  username: string;
  email: string;
  role: string;
  image: string;
  averageRating: number;
  numberOfRatings: number;
}

const InstructorInfo: React.FC<InstructorInfoProps> = ({ instructorId }) => {
  const [instructorData, setInstructorData] = useState<Instructor | null>(null);
  const [ratingMessage, setRatingMessage] = useState<string>('');  

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await api.get(`/user/instructorData/${instructorId}`);
        setInstructorData(response.data);
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      }
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
          src={instructorData.image}
          alt={instructorData.username}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{instructorData.username}</h3>
          <p className="text-gray-600">{instructorData.email}</p>
          <p className="text-gray-600">{instructorData.role}</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 text-sm">
              {'★'.repeat(Math.floor(instructorData.averageRating))}
              {'☆'.repeat(5 - Math.floor(instructorData.averageRating))}
            </span>
            <p className="text-gray-600 text-sm ml-2">
              {instructorData.averageRating.toFixed(1)} ({instructorData.numberOfRatings} Ratings)
            </p>
          </div>
        </div>
      </div>

      {/* Rating Input */}
      <div className="mt-4">
        {ratingMessage && (
          <p className={`mt-2 ${ratingMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {ratingMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorInfo;