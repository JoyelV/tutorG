import React, { useState } from 'react';
import api from '../../../infrastructure/api/api';

interface CourseRatingProps {
  courseId: string | undefined;
  onRatingSubmitted: () => void;
}

const CourseRating: React.FC<CourseRatingProps> = ({ courseId, onRatingSubmitted }) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');

  const submitRating = async (rating: number, feedback: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.patch(
        `/user/rating/${courseId}`,
        { userId, rating, feedback },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setRatingMessage('Your feedback has been submitted successfully!');
        setUserRating(0);
        setComment('');
        onRatingSubmitted(); 
      } else {
        setRatingMessage('Error saving rating and feedback.');
      }
    } catch (error) {
      setRatingMessage('Network error. Please try again.');
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  return (
    <div className="flex flex-col p-1 bg-white rounded-lg">
      {/* Rating Section */}
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => handleRatingClick(star)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment Input */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment for course"
          className="flex-1 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={1}
        />
        <button
          onClick={() => {
            if (userRating && comment.length >= 5) {
              submitRating(userRating, comment);
            }
          }}
          disabled={isSubmitting || !userRating || comment.length < 5}
          className={`h-full p-2 text-white font-bold transition-all ${
            isSubmitting ? 'bg-white cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Rating Message */}
      {ratingMessage && (
        <p className={`mt-4 ${ratingMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {ratingMessage}
        </p>
      )}
    </div>
  );
};

export default CourseRating;
