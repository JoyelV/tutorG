import React from 'react';

interface CourseDescriptionProps {
  description: string;
  learningPoints: string;
  targetAudience: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description, learningPoints, targetAudience }) => {
  return (
    <div className="py-1 px-1 bg-gradient-to-br from-white to-gray-50 rounded-md">
      <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

      <h3 className="text-xl font-semibold text-blue-600 mb-2">What You Will Learn</h3>
      <p className="text-gray-600 leading-relaxed mb-6">{learningPoints}</p>

      <h3 className="text-xl font-semibold text-blue-600 mb-2">Who This Course Is For</h3>
      <p className="text-gray-600 leading-relaxed">{targetAudience}</p>
    </div>
  );
};

export default CourseDescription;
