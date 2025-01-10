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
  }, [instructorId]);

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      setRatingMessage('Please select a rating before submitting.');
      return;
    }

    if (comment.length < 5) {
      setRatingMessage('Comment must be at least 5 characters long.');
      return;
    }

    try {
      const response = await api.put(`/user/instructorRating/${instructorId}`, {
        rating: userRating,
        comment,
      });
      if (response.status === 201) {
        setRatingMessage('Rating submitted successfully!');
      } else if (response.status === 200) {
        setRatingMessage('You have already rated this instructor.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setRatingMessage('Error submitting rating. Please try again.');
    }
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  if (!instructorData) {
    return <p>Loading instructor information...</p>;
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Course Instructor</h2>
      <div className="flex items-center mt-4">
        <img
          src={instructorData.image}
          alt={instructorData.username}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{instructorData.username}</h3>
          <p className="text-gray-600">{instructorData.email}</p>
          <p className="text-gray-600">{instructorData.role}</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 text-sm">
              {'★'.repeat(Math.floor(instructorData.averageRating))}
              {'☆'.repeat(5 - Math.floor(instructorData.averageRating))}
            </span>
            <p className="text-gray-600 text-sm ml-2">
              {instructorData.averageRating.toFixed(1)} ({instructorData.numberOfRatings} Ratings)
            </p>
          </div>
        </div>
      </div>

      {/* Ratings and Comments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Ratings & Comments:</h3>
        <div className="mt-4">
          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <div key={index} className="border-t pt-2">
                <div className="flex items-center space-x-4">
                <img
                  src={rating.userId.image || "https://via.placeholder.com/50"}
                  alt={rating.userId.username || "Student"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="bg-white font-bold">{rating.userId.username}</h4>
                </div>
              </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-2xl">
                    {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                  </span>
                  <p className="text-gray-600 text-sm ml-2">{new Date(rating.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-2">{rating.comment}</p>
              </div>
            ))
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      </div>
      {/* Rating Input */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Rate this Instructor:</h3>
        <div className="flex mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment"
          className="mt-4 p-2 border rounded w-full"
        />
        <button
          onClick={handleRatingSubmit}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={userRating === 0 || comment.length < 5}
        >
          Submit Rating
        </button>
        {ratingMessage && (
          <p className={`mt-2 ${ratingMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {ratingMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorInfo;
