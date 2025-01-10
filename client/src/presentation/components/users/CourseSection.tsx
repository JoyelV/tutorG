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

interface CoursesSectionProps {
  instructorId: string;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ instructorId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/user/course-instructors/${instructorId}`);
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [instructorId]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold bg-white mb-4">Loading Courses...</h2>
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

  const handleCardClick = (courseId: string) => {
    navigate(`/course/details/${courseId}`);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold bg-white mb-4">
        {`Courses (${courses.length})`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 bg-gradient-to-br from-white to-white">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleCardClick(course._id)}
          >
            <div
              className="h-48 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${course.thumbnail || "https://via.placeholder.com/400"})` }}
            ></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="px-2 py-1 rounded-full text-xs font-semibold uppercase bg-gray-200">
                  {course.category}
                </div>
                <div className="font-bold text-xl text-green-500">₹{course.courseFee}</div>
              </div>
              <h2 className="text-start px-2 py-1 text-sm font-semibold text-gray-800 leading-tight">
                {course.title}
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-yellow-500 font-semibold">★ {course.averageRating.toFixed(1)}</div>
                <div className="bg-white">{`${course.students.length} students`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;