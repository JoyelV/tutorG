import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import { useParams } from 'react-router-dom';

interface Feedback {
  username: string; 
  email: string; 
  feedback: string;
  rating: number;
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-3 w-3 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) return <p>{error}</p>;

  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Student Feedback</h2>
      {feedbacks.length > 0 ? (
        feedbacks.map((feed, index) => (
          <div key={index} className="mt-4">
            <p><strong>{feed.username}</strong> ({feed.email})</p> {/* Display username and email */}
            <p>{feed.feedback}</p>
            <p>{'⭐'.repeat(feed.rating)}</p> {/* Display stars based on the rating */}
          </div>
        ))
      ) : (
        <p>No feedback available for this course yet.</p>
      )}
    </div>
  );
};

export default StudentFeedback;
