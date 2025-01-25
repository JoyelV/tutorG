import React from 'react';

interface CourseRequirementsProps {
  requirements: string;
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({ requirements }) => {
  return (
    <div className="py-0">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">Course Requirements</h3>
      <p className="text-gray-600 leading-relaxed mb-6">{requirements}</p>
    </div>
  );
};

export default CourseRequirements;

