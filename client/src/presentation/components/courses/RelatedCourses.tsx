import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../infrastructure/api/api";

interface RelatedCoursesProps {
  courseId: string; 
}

interface Course {
  _id:string;
  title: string;
  category: string;
  courseFee: string;
  thumbnail: string;
  averageRating: string;
  students: string;
  level:string;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "DESIGN":
      return "bg-pink-100 text-pink-600";
    case "WEB DEVELOPMENT":
      return "bg-blue-100 text-blue-600";
    case "DATABASE":
      return "bg-yellow-100 text-yellow-600";
    case "MARKETING":
      return "bg-green-100 text-green-600";
    case "IT & SOFTWARE":
      return "bg-purple-100 text-purple-600";
    case "MUSIC":
      return "bg-teal-100 text-teal-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ courseId }) => {
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const response = await api.get(`/user/related/${courseId}`);
        const data = await response.data;
        setRelatedCourses(data);
      } catch (error) {
        console.error("Error fetching related courses:", error);
      }
    };

    fetchRelatedCourses();
  }, [courseId]);

  const handleCardClick = (id: string) => {
    navigate(`/course/details/${id}`);
  };

  if (relatedCourses.length === 0) {
    return null; 
  }

  return (
    <div>
      <h3 className="font-bold text-3xl text-left pl-10 pt-9">Related Courses</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-gray-100">
        {relatedCourses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => handleCardClick(course._id)}
          >
            <div
              className="h-48 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            ></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`${getCategoryColor(
                    course.category
                  )} px-2 py-1 rounded-full text-xs font-semibold uppercase`}
                >
                  {course.category}
                </div>
                <div className="font-bold text-xl text-green-500">
                  {course.courseFee}
                </div>
              </div>
              <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                {course.title}
              </h2>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-yellow-500 font-semibold mr-1">
                    ★ {course.averageRating}
                  </span>
                </div>
                <div>
                  <span className="text-right text-gray-500 font-semibold">
                    {course.students.length} students
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
