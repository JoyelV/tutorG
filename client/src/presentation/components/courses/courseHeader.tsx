import React from "react";

const CourseHeader: React.FC = () => {
  return (
    <div className="bg-white p-4 md:p-8">
      {/* Course Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Complete Web Design: from Figma to Webflow - 2024 UI
      </h1>
      
      {/* Course Subtitle */}
      <p className="text-lg text-gray-600 mb-4">
        3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.
      </p>
      
      {/* Instructor and Rating Section */}
      <div className="flex items-center">
        {/* Instructors */}
        <div className="flex items-center space-x-2">
          <img
            src="https://randomuser.me/api/portraits/women/1.jpg"
            alt="Dianne Russell"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <p className="text-sm text-gray-700">
            Created by: <span className="font-medium">Dianne Russell</span> &bull;
          </p>
        </div>
        
        {/* Rating */}
        <div className="flex items-center ml-4">
          <span className="text-orange-500 text-lg">★★★★★</span>
          <p className="text-gray-700 text-sm ml-2">4.8 (451,444 Ratings)</p>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
