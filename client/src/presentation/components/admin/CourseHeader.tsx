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
  averageRating:number;
  numberOfRatings:number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseTitle, courseSubtitle, instructorId }) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      const response = await api.get(`/admin/instructorProfile/${instructorId}`)
      setInstructor(response.data);
    };

    fetchInstructorData();
  }, [instructorId]);

  if (!instructor) {
      return (
        <div className="flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
        </div>
      );
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
          src={instructor.image}
          alt={instructor.username}
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <p className="text-sm text-gray-700">
            Created by: <span className="font-medium">{instructor.username}</span> &bull;
          </p>
        </div>
        
        {/* Rating */}
        <div className="flex items-center ml-4">
          <span className="text-orange-500 text-sm">
            {'★'.repeat(Math.floor(instructor.averageRating))}
            {'☆'.repeat(5 - Math.floor(instructor.averageRating))}
          </span>
          <p className="text-gray-700 text-sm ml-2">
            {instructor.averageRating.toFixed(1)} ({instructor.numberOfRatings} Ratings)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
