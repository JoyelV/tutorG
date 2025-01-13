import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import CourseSidebar from '../../components/common/CourseSideBar';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseImage from '../../components/courses/CourseImage';
import CourseRequirements from '../../components/courses/CourseRequirements';
import RelatedCourses from '../../components/courses/RelatedCourses';
import StudentFeedback from '../../components/courses/StudentFeedback';
import api from '../../../infrastructure/api/api';
import { ToastContainer } from 'react-toastify';
import CourseHeader from '../../components/users/CourseHeader';
import CurriculumDetailed from '../../components/courses/DetailedCurriculumPage';
import InstructorInfo from '../../components/courses/InstructorRate';

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Feedback';

const CoursePage = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        if (!courseId) {
          throw new Error('Invalid Course ID.');
        }
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status === 200) {
          setCourseData(response.data);
          setSelectedVideoUrl(response.data.trailer);
        } else {
          throw new Error('Course not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <ToastContainer />
      <Navbar />
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Course Details Section */}
        <div className="md:w-2/3 w-full p-6">
          <CourseHeader courseTitle={courseData.title} courseSubtitle={courseData.subtitle} instructorId={courseData.instructorId} />
          <CourseImage id={courseId} />

          {/* Section Navigation - Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
            {['Description', 'Requirements', 'Curriculum', 'Instructor', 'Feedback'].map((section) => (
              <button
                key={section}
                className={`text-lg py-2 px-4 whitespace-nowrap transition-all duration-300 ${currentSection === section
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
            className="transition-all duration-300 ease-in-out bg-white p-4 md:p-8 rounded-lg shadow-md"
            style={{ minHeight: '300px' }}
          >
            {/* Description Section */}
            {currentSection === 'Description' && (
              <CourseDescription
                description={courseData.description}
                learningPoints={courseData.learningPoints}
                targetAudience={courseData.targetAudience}
              />
            )}

            {/* Requirements Section */}
            {currentSection === 'Requirements' && (
              <CourseRequirements requirements={courseData.requirements} />
            )}

            {/* Curriculum Section */}
            {currentSection === 'Curriculum' && (
              <CurriculumDetailed
                onLessonSelect={(videoUrl) => setSelectedVideoUrl(videoUrl)}
              />
            )}

            {/* Instructor Section */}
            {currentSection === 'Instructor' && (
              <InstructorInfo instructorId={courseData.instructorId} />
            )}

            {/* Feedback Section */}
            {currentSection === 'Feedback' && <StudentFeedback />}
          </div>
        </div>

        {/* Sidebar Section (Fixed) */}
        <div className="hidden md:block md:w-1/3 w-full p-6">
          <div className="sticky top-4">
            <CourseSidebar
              course_Id={courseData.courseId}
              courseFee={courseData.courseFee}
              duration={courseData.duration}
              level={courseData.level}
              language={courseData.language}
              students={courseData.students}
              subtitleLanguage="English"
            />
          </div>
        </div>
      </div>
      {/* Related Courses Section */}
      <RelatedCourses courseId={courseId!} />
    </div>
  );
};

export default CoursePage;
