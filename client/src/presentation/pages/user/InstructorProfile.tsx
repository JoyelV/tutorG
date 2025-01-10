import React from "react";
import { useParams } from "react-router-dom";
import ProfileSection from "../../components/users/ProfileSection";
import CoursesSection from "../../components/users/CourseSection";
import FeedbackSection from "../../components/users/FeedbackSection";

const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const instructorId = id || ""; 

  if (!instructorId) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-red-500">Instructor ID is missing or invalid.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <ProfileSection instructorId={instructorId} />
      <CoursesSection instructorId={instructorId} />
      <FeedbackSection instructorId={instructorId} />
    </div>
  );
};

export default InstructorProfile;
