// CourseRating.js
import React from 'react';

const CourseRating = () => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Course Rating</h2>
      <div className="mt-2">
        <p>4.8 ★★★★★ (5,000+ Ratings)</p>
        {/* Add review breakdown if needed */}
      </div>
    </div>
  );
};

export default CourseRating;
