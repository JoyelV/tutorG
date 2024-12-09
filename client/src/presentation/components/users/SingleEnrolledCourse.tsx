import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseImage from '../../components/courses/CourseImage';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import InstructorInfo from '../../components/courses/InstructorInfo';
import RelatedCourses from '../../components/courses/RelatedCourses';
import StudentFeedback from '../../components/courses/StudentFeedback';
import api from '../../../infrastructure/api/api';
import CurriculumBox from '../../components/courses/CourseCurriculumBox';
import CourseHeader from './CourseHeader';

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Rating' | 'Feedback';

const CoursePage = () => {
  const { courseId } = useParams();
  const [currentSection, setCurrentSection] = useState<Section>('Description');
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

    if (courseId) {
      fetchCourseData();
    }
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
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Course Details Section */}
        <div className="md:w-2/3 w-full p-6">
          <CourseHeader
            courseTitle={courseData.title}
            courseSubtitle={courseData.subtitle}
            instructorId={courseData.instructorId}
          />
          <CourseImage id={courseId} /> {/* Passing courseId to CourseImage component */}

          {/* Section Navigation - Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {['Description', 'Requirements', 'Instructor', 'Rating', 'Feedback'].map((section) => (
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
            {currentSection === 'Instructor' && <InstructorInfo instructorId={courseData.instructorId} />}
            {currentSection === 'Rating' && <CourseRating courseId={courseId} />}
            {currentSection === 'Feedback' && <StudentFeedback />}
          </div>
        </div>

        {/* Curriculum Box (Right Side) */}
        <div className="md:w-1/3 w-full bg-gray-50 p-6 shadow-md md:block hidden">
          <CurriculumBox />
        </div>
      </div>

      {/* Related Courses Section */}
      <RelatedCourses />
    </div>
  );
};

export default CoursePage;
