import React from 'react';

interface CourseDescriptionProps {
  description: string;
  learningPoints: string;
  targetAudience: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description, learningPoints, targetAudience }) => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Description</h2>
      <p className="text-gray-700 my-2">{description}</p>
      <h3 className="text-xl font-semibold mt-4">What you will learn in this course</h3>
      <p className="text-gray-700 my-2">{learningPoints}</p>
      <h3 className="text-xl font-semibold mt-4">Who this course is for</h3>
      <p className="text-gray-700 my-2">{targetAudience}</p>
    </div>
  );
};

export default CourseDescription;
