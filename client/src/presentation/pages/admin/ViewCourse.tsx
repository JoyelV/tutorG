import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import CourseDescription from '../../components/courses/CourseDescription';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import StudentFeedback from '../../components/courses/StudentFeedback';
import api from '../../../infrastructure/api/api';
import CourseVideo from '../../components/instructor/CourseVideo';
import CurriculumPage from '../../components/courses/CourseCurriculums';
import Sidebar from '../../components/admin/Sidebar';
import CourseHeader from '../../components/courses/courseHeader';

type Section = 'Description' | 'Requirements' | 'Rating' | 'Feedback';

const CourseViewPage = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        if (!courseId) {
          throw new Error('Invalid Course ID.');
        }
        const response = await api.get(`/admin/courseDetailview/${courseId}`);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-3 bg-gray-50">
        {/* Header */}
        <CourseHeader
          courseTitle={courseData.title}
          courseSubtitle={courseData.subtitle}
          instructorId={courseData.instructorId}
        />

        {/* Body Section */}
        <div className="flex mt-6">
          {/* Left Content */}
          <div className="flex-1 pr-4">
            <CourseVideo id={courseData._id} />

            {/* Section Navigation */}
            <div className="flex border-b border-gray-200 mt-6 mb-6">
              {['Description', 'Requirements', 'Rating', 'Feedback'].map((section) => (
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
            <div className="transition-all duration-300 ease-in-out">
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
              {currentSection === 'Rating' && <CourseRating />}
              {currentSection === 'Feedback' && <StudentFeedback />}
            </div>
          </div>

          {/* Right Content - Curriculum */}
          <div className="w-1/3 bg-white shadow-lg p-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Curriculum</h3>
            <CurriculumPage />
            {/* Add Lesson Button */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;