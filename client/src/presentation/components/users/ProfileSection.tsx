import React, { useState, useEffect } from "react";
import api from "../../../infrastructure/api/api";

interface InstructorData {
  username: string;
  image: string;
  bio: string;
  about: string;
  headline: string;
  areasOfExpertise: string;
  highestQualification: string;
  averageRating: number;
  numberOfRatings: number;
  totalStudents: number;
  totalCourses: number;
}

const ProfileSection: React.FC<{ instructorId: string }> = ({ instructorId }) => {
  const [instructorData, setInstructorData] = useState<InstructorData | null>(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await api.get(`/user/instructors/${instructorId}`);
        setInstructorData(response.data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };

    fetchInstructorData();
  }, [instructorId]);

  if (!instructorData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="container mx-auto px-8 py-6 bg-white shadow-lg rounded-lg mt-4">
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Image Section */}
        <div className="w-24 h-24 mx-auto md:w-32 md:h-32 flex justify-center items-start mb-4 md:mb-0">
          <img
            src={instructorData.image || "https://via.placeholder.com/150"}
            alt={instructorData.username}
            className="w-full h-full rounded-full border-4 border-orange-500"
          />
        </div>

        {/* Instructor Details Section */}
        <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{instructorData.username}</h1>
          <p className="text-sm text-gray-600 mt-1">{instructorData.headline}</p>
          <p className="text-gray-700 leading-relaxed mt-2">
            <strong>Areas of Expertise:</strong> {instructorData.areasOfExpertise}
          </p>
          <p className="text-gray-700 leading-relaxed mt-1">
            <strong>Highest Qualification:</strong> {instructorData.highestQualification}
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-yellow-500">{`⭐ ${instructorData.averageRating.toFixed(1)}`}</span>
            <span className="text-gray-500">({instructorData.numberOfRatings} reviews)</span>
            <span className="text-gray-500">{`${instructorData.totalStudents} students`}</span>
            <span className="text-gray-500">{`${instructorData.totalCourses} courses`}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full md:flex-1 px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">ABOUT ME</h2>
          <p className="text-gray-700 leading-relaxed">{instructorData.about}</p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
