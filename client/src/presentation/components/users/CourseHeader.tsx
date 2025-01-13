import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import baseUrl from '../../../Constants/BaseUrl';

interface CourseHeaderProps {
  courseTitle: string;
  courseSubtitle: string;
  instructorId: string;
}

interface Instructor {
  username: string;
  image: string;
  averageRating: number;
  numberOfRatings: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseTitle, courseSubtitle, instructorId }) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      const response = await api.get(`/user/instructorData/${instructorId}`);
      setInstructor(response.data);
    };

    fetchInstructorData();
  }, [instructorId]);

  if (!instructor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-8">
      {/* Course Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
        {courseTitle}
      </h1>

      {/* Course Subtitle */}
      <p className="text-base md:text-lg text-gray-600 mb-4 text-center md:text-left">
        {courseSubtitle}
      </p>

      {/* Instructor and Rating Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start">
        {/* Instructor Info */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <img
            src={instructor.image}
            alt={instructor.username}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200"
          />
          <p className="text-sm text-gray-700">
            Created by: <span className="font-medium">{instructor.username}</span>
          </p>
        </div>

        {/* Rating Section */}
        <div className="flex items-center ml-0 md:ml-4">
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
