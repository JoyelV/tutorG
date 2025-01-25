import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';

interface InstructorInfoProps {
  instructorId: string;
}

interface Instructor {
  username: string;
  email: string;
  role: string;
  image: string;
  averageRating: number;
  numberOfRatings: number;
}

interface Rating {
  rating: number;
  comment: string;
  userId: Instructor;
  createdAt: string;
}

const InstructorInfo: React.FC<InstructorInfoProps> = ({ instructorId }) => {
  const [instructorData, setInstructorData] = useState<Instructor | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [ratingMessage, setRatingMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await api.get(`/user/instructorData/${instructorId}`);
        setInstructorData(response.data);
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      }
    };

    const fetchInstructorRatings = async () => {
      try {
        const response = await api.get(`/user/instructor-feedback/${instructorId}`);
        setRatings(response.data);
      } catch (error) {
        console.error('Error fetching instructor ratings:', error);
      }
    };

    fetchInstructorData();
    fetchInstructorRatings();
  }, [instructorId, comment]);

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      setRatingMessage('Please select a rating before submitting.');
      return;
    }

    if (comment.length < 5) {
      setRatingMessage('Comment must be at least 5 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(`/user/instructorRating/${instructorId}`, {
        rating: userRating,
        comment,
      });
      if (response.status === 201) {
        setRatingMessage('Rating submitted successfully!');
        setUserRating(0);
        setComment('');
      } else if (response.status === 200) {
        setRatingMessage('You have already rated this instructor.');
        setUserRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setRatingMessage('Error submitting rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  if (!instructorData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-blue-600">Course Instructor</h2>
      <div className="flex items-center my-4">
        <img
          src={instructorData.image}
          alt={instructorData.username}
          className="w-16 h-16 rounded-full shadow-lg mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{instructorData.username}</h3>
          <p className="text-gray-700">{instructorData.email}</p>
          <span className="text-orange-500 text-md">
            {'★'.repeat(Math.floor(instructorData.averageRating))}
            {'☆'.repeat(5 - Math.floor(instructorData.averageRating))}
            {instructorData.averageRating.toFixed(1)} ({instructorData.numberOfRatings} Reviews)
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4 text-blue-600">Students about Instructor</h3>
      <div className="my-4 space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center">
                <img
                  src={rating.userId.image || 'https://via.placeholder.com/50'}
                  alt={rating.userId.username || 'Student'}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{rating.userId.username}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 my-2">{rating.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-md mt-6">
            <span className="text-green-500">No ratings yet.</span>
          </p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-4 text-blue-600">Rate Instructor</h3>
      <div className="flex items-center mt-4 space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-500' : 'text-gray-300'
              }`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment for instructor"
          className="flex-1 resize-none p-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={1}
        />
        {/* Button */}
        <button
          onClick={handleRatingSubmit}
          disabled={isSubmitting || userRating === 0 || comment.length < 5}
          className={`h-full p-2 text-white font-bold transition-all ${isSubmitting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600'
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {ratingMessage && (
        <p
          className={`mt-4 ${ratingMessage.includes('success') ? 'text-green-500' : 'text-red-500'
            }`}
        >
          {ratingMessage}
        </p>
      )}
    </div>
  );
};

export default InstructorInfo;