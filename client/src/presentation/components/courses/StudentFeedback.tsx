import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import { useParams } from 'react-router-dom';

// Define the Feedback interface
interface Feedback {
  username: string; // The username directly from the response
  email: string; // The email directly from the response
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
        setFeedbacks(response.data.feedbacks); // Assuming 'feedbacks' is the key in the response
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [courseId]); // Adding courseId as a dependency to refetch when it changes

  if (loading) return <p>Loading feedbacks...</p>;
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
