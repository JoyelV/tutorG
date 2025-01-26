import React from "react";
import { useParams } from "react-router-dom";
import ProfileSection from "../../components/users/ProfileSection";
import CoursesSection from "../../components/users/CourseSection";

const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const instructorId = id || "";

  if (!instructorId) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <p className="text-lg sm:text-xl font-bold text-red-500 text-center">
          Instructor ID is missing or data is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="w-full px-0">
        {/* Profile Section */}
        <div className="mt-0 sm:mt-6 w-full">
          <ProfileSection instructorId={instructorId} />
        </div>

        {/* Courses Section */}
        <div className="mt-0 sm:mt-6 w-full">
          <CoursesSection instructorId={instructorId} />
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
