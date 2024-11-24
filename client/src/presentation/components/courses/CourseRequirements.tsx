import React from 'react';

interface CourseRequirementsProps {
  requirements: string;
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({ requirements }) => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Course Requirements</h2>
      <p className="text-gray-700 my-2">{requirements}</p>
    </div>
  );
};

export default CourseRequirements;

