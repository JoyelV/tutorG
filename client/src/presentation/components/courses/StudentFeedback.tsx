import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns'; 

interface Feedback {
  username: string; 
  email: string; 
  image:string;
  feedback: string;
  rating: number;
  updatedAt: string;
}

const StudentFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get(`/user/feedbacks/${courseId}`);
        setFeedbacks(response.data.feedbacks); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [courseId]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) return <p>{error}</p>;

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mt-4">Course Rating</h3>
      {feedbacks.length > 0 ? (
        feedbacks.map((feed, index) => (
          <div
            key={index}
            className="flex items-center mt-2 p-2 bg-white rounded-lg shadow-md" 
          >
            <img
              src={feed.image || 'https://via.placeholder.com/64'} 
              alt={feed.username}
              className="w-12 h-12 rounded-full shadow-lg mr-4" 
            />
            <div className="flex-1">
              <p className="font-bold">{feed.username}</p>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(feed.updatedAt), { addSuffix: true })}
              </p>
              <p className="mt-2">{feed.feedback}</p>
              <p className="mt-1 text-yellow-500">{'⭐'.repeat(feed.rating)}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No feedback available for this course yet.</p>
      )}
    </div>
  );  
};

export default StudentFeedback;
