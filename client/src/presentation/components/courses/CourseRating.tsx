// CourseRating.tsx
import React from 'react';

const CourseRating: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Course Rating</h2>
      <div className="flex items-center space-x-2">
        <span className="text-md font-bold text-gray-800">4.8</span>
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <svg key={i} className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.573 8.332 1.151-6.001 5.539 1.447 8.15-7.446-4.175-7.446 4.175 1.447-8.15-6.001-5.539 8.332-1.151z" />
            </svg>
          ))}
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.573 8.332 1.151-6.001 5.539 1.447 8.15-7.446-4.175-7.446 4.175 1.447-8.15-6.001-5.539 8.332-1.151z" />
          </svg>
        </div>
      </div>
      <p className="text-gray-600 mt-2">Course Rating</p>
      <div className="mt-6 w-full space-y-2">
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-orange-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.573 8.332 1.151-6.001 5.539 1.447 8.15-7.446-4.175-7.446 4.175 1.447-8.15-6.001-5.539 8.332-1.151z" />
                </svg>
              ))}
            </div>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-orange-500 h-2.5 rounded-full"
                style={{ width: `${[75, 21, 3, 1, 0.5][index]}%` }}
              ></div>
            </div>
            <span className="text-gray-600 text-sm">{[75, 21, 3, 1, '<1'][index]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRating;
