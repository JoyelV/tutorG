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

  if (!instructorData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-0">
      <h2 className="text-xl font-semibold text-blue-600">Course Instructor</h2>
      <div className="flex items-center my-2">
        <img
          src={instructorData.image}
          alt={instructorData.username}
          className="w-16 h-16 rounded-full shadow-lg mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{instructorData.username}</h3>
          <p className="text-gray-700">{instructorData.email}</p>
          <p className="text-gray-700">{instructorData.role}</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 text-sm">
              {'★'.repeat(Math.floor(instructorData.averageRating))}
              {'☆'.repeat(5 - Math.floor(instructorData.averageRating))}
            </span>
            <p className="text-gray-600 text-sm ml-2">
              {instructorData.averageRating.toFixed(1)} ({instructorData.numberOfRatings} Reviews)
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-3 text-blue-600">Students about Instructor</h3>
      <div className="my-2 space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <div key={index} className="p-4 rounded-lg">
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
              <span className="text-orange-500 text-md">
            {'★'.repeat(Math.floor(rating.rating))}
            {'☆'.repeat(5 - Math.floor(rating.rating))}
            </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center font-semibold text-lg mt-3">
            <span className="text-green-500">No ratings yet.</span>
          </p>
        )}
      </div>
      {ratingMessage && (
        <p className={`mt-4 ${ratingMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {ratingMessage}
        </p>
      )}
    </div>
  );
};

export default InstructorInfo;