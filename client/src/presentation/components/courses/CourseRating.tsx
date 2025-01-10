import React, { useState } from 'react';
import api from '../../../infrastructure/api/api';

interface CourseRatingProps {
  courseId: string | undefined;
}

const CourseRating: React.FC<CourseRatingProps> = ({ courseId }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userId = localStorage.getItem('userId');
  
  const submitRating = async (rating: number, feedback: string) => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);

    try {
      const response = await api.patch(
        `/user/rating/${courseId}`,
        { userId,rating, feedback },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        setIsSubmitted(true); 
        setUserRating(null); 
        setFeedback(''); 
      } else {
        console.error('Error saving rating and feedback');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (!isSubmitted) {
      setUserRating(rating);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setFeedback(e.target.value);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-md font-semibold text-gray-800 mb-2">Course Feedback</h2>
      {/* User rating section */}
      <div className="mt-4">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-8 h-8 cursor-pointer ${i < (userRating ?? 0) ? 'text-orange-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              onClick={() => handleRatingClick(i + 1)}
            >
              <path d="M12 .587l3.668 7.573 8.332 1.151-6.001 5.539 1.447 8.15-7.446-4.175-7.446 4.175 1.447-8.15-6.001-5.539 8.332-1.151z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Feedback input */}
      <div className="mt-6 w-full">
        <input
          type="text"
          id="feedback"
          value={feedback}
          onChange={handleFeedbackChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your feedback"
          disabled={isSubmitted} 
        />
      </div>

      {/* Submit button */}
      <button
        className="mt-6 bg-blue-500 text-white p-2 rounded-md"
        onClick={() => {
          if (userRating && !isSubmitted) {
            submitRating(userRating, feedback);
          }
        }}
        disabled={isSubmitting || !userRating || !feedback || isSubmitted} 
      >
        {isSubmitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
};

export default CourseRating;
