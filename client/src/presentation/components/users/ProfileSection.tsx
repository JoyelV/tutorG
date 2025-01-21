import React, { useEffect, useState } from "react";
import api from "../../../infrastructure/api/api";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

interface Instructor {
  username: string;
  email: string;
  image: string;
  headline: string;
  averageRating: number;
  numberOfRatings: number;
  highestQualification: string;
  totalStudents: number;
  totalCourses: number;
  about: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  github: string;
}

interface ProfileSectionProps {
  instructorId: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ instructorId }) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await api.get(`/user/instructors/${instructorId}`);
        setInstructor(response.data);
      } catch (error) {
        console.error("Failed to fetch instructor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="animate-pulse rounded-full h-6 w-6 bg-blue-500"></div>
        <span className="ml-3 text-xl">Loading Instructor Details...</span>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="text-center py-10 text-xl font-semibold">
        Instructor not found.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 via-purple-100 to-pink-50 p-4 sm:p-6 w-full">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:justify-between items-center">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          {/* Profile Image */}
          <div className="rounded-full w-20 h-20 sm:w-32 sm:h-32 overflow-hidden border-4 border-white shadow-xl transform hover:scale-105 transition-transform">
            <img
              src={instructor.image}
              alt={instructor.username}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Profile Details */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
              {instructor.username}
              {instructor.averageRating > 4.5 && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-md font-semibold ml-2">
                  <span role="img" aria-label="crown">
                    👑
                  </span>{" "}
                  Top Rated
                </span>
              )}
            </h1>
            <h6 className="text-sm italic text-gray-600">{instructor.email}</h6>
            <p className="text-gray-700 text-sm sm:text-base">
              {instructor.headline}
            </p>
            <p className="text-gray-500 text-sm">{instructor.highestQualification}</p>
            <div className="mt-4 space-x-2 sm:space-x-4 flex flex-wrap justify-center sm:justify-start text-sm text-gray-600">
              <div className="flex items-center space-x-1 text-yellow-500">
                <span>⭐ {instructor.averageRating.toFixed(1)}</span>
                <span>({instructor.numberOfRatings} reviews)</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-600">
                <span>👩‍🎓</span>
                <span>{instructor.totalStudents} students</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <span>📚</span>
                <span>{instructor.totalCourses} courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4">
          <a
            href={instructor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center space-x-1 text-sm"
          >
            🌐
            <span>{instructor.website}</span>
          </a>
          <div className="flex space-x-3 mt-2">
            {[
              { href: instructor.facebook, Icon: FacebookIcon },
              { href: instructor.instagram, Icon: InstagramIcon },
              { href: instructor.twitter, Icon: TwitterIcon },
              { href: instructor.linkedin, Icon: LinkedInIcon },
              { href: instructor.github, Icon: GitHubIcon },
            ].map(({ href, Icon }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-blue-300 transition duration-300"
              >
                <Icon style={{ color: "gray" }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-6 max-w-6xl mx-auto px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">ABOUT ME</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {instructor.about}
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;