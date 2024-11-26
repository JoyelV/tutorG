import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import CourseSidebar from '../../components/common/CourseSideBar';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseImage from '../../components/courses/CourseImage';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import InstructorInfo from '../../components/courses/InstructorInfo';
import RelatedCourses from '../../components/courses/RelatedCourses';
import StudentFeedback from '../../components/courses/StudentFeedback';
import CourseHeader from '../../components/courses/courseHeader';
import api from '../../../infrastructure/api/api';
import CurriculumPage from '../../components/courses/CourseCurriculums';

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Rating' | 'Feedback';

const CoursePage = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <Navbar />
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Course Details Section */}
        <div className="md:w-2/3 w-full p-6">
          <CourseHeader courseTitle={courseData.title} courseSubtitle={courseData.subtitle} instructorId={courseData.instructorId} />
          <CourseImage courseId={courseId} /> 
          
          {/* Section Navigation - Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
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
          <div className="transition-all duration-300 ease-in-out" style={{ minHeight: '300px' }}>
            {currentSection === 'Description' && (
             <CourseDescription 
             description={courseData.description} 
             learningPoints={courseData.learningPoints} 
             targetAudience={courseData.targetAudience} 
           />
           
            )}
            {currentSection === 'Requirements' && (
              <CourseRequirements requirements={courseData.requirements} />
            )}
            {currentSection === 'Curriculum' && (
              <CurriculumPage />
            )}
            {currentSection === 'Instructor' && (
              <InstructorInfo instructorId={courseData.instructorId} />
            )}
            {currentSection === 'Rating' && <CourseRating/>}
            {currentSection === 'Feedback' && <StudentFeedback />}
          </div>
        </div>

        {/* Sidebar Section (Fixed) */}
        <div className="hidden md:block md:w-1/3 w-full p-6">
          <div className="sticky top-4">
          <CourseSidebar 
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
      <RelatedCourses/>
    </div>
  );
};

export default CoursePage;
