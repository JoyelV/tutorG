import { useState } from 'react';
import CourseSidebar from "../../components/CourseSideBar";
import CourseCurriculum from "../../components/courses/CourseCurriculum";
import CourseDescription from "../../components/courses/CourseDescription";
import CourseImage from "../../components/courses/CourseImage";
import CourseRating from "../../components/courses/CourseRating";
import CourseRequirements from "../../components/courses/CourseRequirements";
import InstructorInfo from "../../components/courses/InstructorInfo";
import RelatedCourses from "../../components/courses/RelatedCourses";
import StudentFeedback from "../../components/courses/StudentFeedback";
import CourseHeader from "../../components/courses/courseHeader";

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Rating' | 'Feedback';

const CoursePage = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Course Details Section */}
        <div className="md:w-2/3 w-full p-6">
          <CourseHeader />
          <CourseImage />
          
          {/* Section Navigation - Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {/* Tab Buttons */}
            {['Description', 'Requirements', 'Curriculum', 'Instructor', 'Rating', 'Feedback'].map((section) => (
              <button
                key={section}
                className={`text-lg py-2 px-4 transition-all duration-300 ${
                  currentSection === section
                    ? 'font-bold border-b-4 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => handleSectionChange(section as Section)}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Dynamic Section Display */}
          <div
            className="transition-all duration-300 ease-in-out"
            style={{ minHeight: '300px' }}  // Make sure content has a min-height
          >
            {currentSection === 'Description' && <CourseDescription />}
            {currentSection === 'Requirements' && <CourseRequirements />}
            {currentSection === 'Curriculum' && <CourseCurriculum />}
            {currentSection === 'Instructor' && <InstructorInfo />}
            {currentSection === 'Rating' && <CourseRating />}
            {currentSection === 'Feedback' && <StudentFeedback />}
          </div>
        </div>

        {/* Sidebar Section (Fixed) */}
        <div className="hidden md:block md:w-1/3 w-full p-6">
          <div className="sticky top-4">
            <CourseSidebar />
          </div>
        </div>
      </div>

      {/* Related Courses Section */}
      <RelatedCourses />
    </div>
  );
};

export default CoursePage;
