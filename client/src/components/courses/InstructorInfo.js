import React from 'react';

const InstructorInfo = () => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Course Instructor</h2>
      <div className="flex items-center mt-4">
        <img
          src="https://link-to-instructor-image.com/image.jpg"
          alt="Instructor"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">Vako Shvili</h3>
          <p className="text-gray-600">UX Designer & Webflow Expert</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorInfo;
