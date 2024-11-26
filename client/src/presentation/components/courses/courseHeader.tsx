import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';

interface CourseHeaderProps {
  courseTitle: string;
  courseSubtitle: string;
  instructorId: string;
}

interface Instructor {
  username: string;
  image: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseTitle, courseSubtitle, instructorId }) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const url = 'http://localhost:5000';

  useEffect(() => {
    // Simulate fetching instructor data
    const fetchInstructorData = async () => {
      // Replace this mock API call with a real one
      const response = await api.get(`/instructor/profile/${instructorId}`)
      setInstructor(response.data);
    };

    fetchInstructorData();
  }, [instructorId]);

  if (!instructor) {
    return <p>Loading instructor information...</p>;
  }

  return (
    <div className="bg-white p-4 md:p-8">
      {/* Course Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{courseTitle}</h1>
      
      {/* Course Subtitle */}
      <p className="text-lg text-gray-600 mb-4">{courseSubtitle}</p>
      
      {/* Instructor and Rating Section */}
      <div className="flex items-center">
        {/* Instructors */}
        <div className="flex items-center space-x-2">
          <img
          src={`${url}/${instructor.image}`}
          alt={instructor.username}
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <p className="text-sm text-gray-700">
            Created by: <span className="font-medium">{instructor.username}</span> &bull;
          </p>
        </div>
        
        {/* Rating (this can also be dynamic based on props or API) */}
        <div className="flex items-center ml-4">
          <span className="text-orange-500 text-sm">★★★★★</span>
          <p className="text-gray-700 text-sm ml-2">4.8 (451,444 Ratings)</p>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
