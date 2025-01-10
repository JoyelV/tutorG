import React, { useEffect, useState } from "react";
import api from "../../../infrastructure/api/api";

interface User {
  username: string;
  image: string;
}

interface Feedback {
  userId: User;
  rating: number;
  comment: string;
  createdAt: string;
}

interface FeedbackSectionProps {
  instructorId: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ instructorId }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/user/instructor-feedback/${instructorId}`);
        const feedbackData: Feedback[] = response.data;

        if (Array.isArray(feedbackData) && feedbackData.length > 0) {
          setFeedbacks(feedbackData);
          const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
          setAverageRating(totalRating / feedbackData.length);
        } else {
          setFeedbacks([]);
          setAverageRating(null);
        }
      } catch (err) {
        setError("Failed to fetch feedback. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [instructorId]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold bg-white mb-4">Loading Feedback...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold bg-white mb-4">{error}</h2>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold bg-white mb-4">Students Feedback</h2>
      {averageRating !== null ? (
        <p className="text-lg font-bold bg-white mb-4">
          {`Average Rating: ⭐ ${averageRating.toFixed(1)}`}
        </p>
      ) : (
        <p className="text-lg font-bold bg-whitemb-4">No ratings yet.</p>
      )}
      <div className="space-y-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={feedback.userId.image || "https://via.placeholder.com/50"}
                  alt={feedback.userId.username || "Student"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="bg-white font-bold">{feedback.userId.username}</h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="bg-white mt-4">
                <strong>Rating:</strong> ⭐ {feedback.rating}
              </p>
              <p className="bg-white mt-2">{feedback.comment || "No comments provided."}</p>
            </div>
          ))
        ) : (
          <p className="bg-white">No feedback available.</p>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;