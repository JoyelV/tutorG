import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../infrastructure/api/api";

interface Course {
  _id: string;
  title: string;
  category: string;
  courseFee: number;
  thumbnail: string;
  averageRating: number;
  students: string[];
}

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

interface InstructorDetailsProps {
  instructorId: string;
}

const InstructorDetails: React.FC<InstructorDetailsProps> = ({ instructorId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await api.get(`/user/course-instructors/${instructorId}`);
        setCourses(coursesResponse.data);

        const feedbackResponse = await api.get(`/user/instructor-feedback/${instructorId}`);
        const feedbackData: Feedback[] = feedbackResponse.data;

        if (Array.isArray(feedbackData) && feedbackData.length > 0) {
          setFeedbacks(feedbackData);
          const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
          setAverageRating(totalRating / feedbackData.length);
        } else {
          setFeedbacks([]);
          setAverageRating(null);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instructorId]);

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-bold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Courses Section */}
        <section className="container mx-auto px-8 sm:px-16 py-4 sm:py-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 italic">{`Courses (${courses.length})`}</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 bg-gradient-to-br from-white to-white">
          {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleCardClick(course._id)}
              >
                <div
                  className="h-48 bg-cover bg-center rounded-t-2xl"
                  style={{
                    backgroundImage: `url(${course.thumbnail || "https://via.placeholder.com/400"})`,
                  }}
                ></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`${course.category} px-2 py-1 rounded-full text-xs font-semibold uppercase`}
                    >
                      {course.category}
                    </div>
                    <div className="font-bold text-xl text-green-500">₹{course.courseFee}</div>
                  </div>
                  <h2 className="text-start px-2 py-1 text-sm font-semibold text-gray-800 leading-tight">
                    {course.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-500 font-semibold">
                      ★ {course.averageRating.toFixed(1)}
                    </div>
                    <div className="text-gray-500">{`${course.students.length} students`}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Feedback Section */}
        <section className="container mx-auto px-8 sm:px-16 py-4 sm:py-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 italic">
            Students Feedbacks
          </h2>
          <div className="space-y-2">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow rounded-lg p-4 flex flex-col space-y-3"
                >
                  {/* Header Section */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={feedback.userId.image || "https://via.placeholder.com/50"}
                      alt={feedback.userId.username || "Student"}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex items-center justify-between space-x-2">
                      <h4 className="font-bold text-sm sm:text-base">
                        {feedback.userId.username}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {(() => {
                          const commentDate = new Date(feedback.createdAt);
                          const today = new Date();
                          const timeDifference = today.getTime() - commentDate.getTime();
                          const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

                          if (daysAgo === 0) {
                            return commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          } else if (daysAgo === 1) {
                            return "Yesterday";
                          } else {
                            return `${daysAgo} days ago`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                  {/* Rating Section */}
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: feedback.rating }, (_, index) => (
                      <span key={index} role="img" aria-label="star">
                        ⭐
                      </span>
                    ))}
                  </div>
                  {/* Comment Section */}
                  <p className="text-sm sm:text-base text-gray-700">
                    {feedback.comment || "No comments provided."}
                  </p>
                </div>
              ))
            ) : (
              <p>No feedback available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstructorDetails;