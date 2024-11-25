import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseCurriculum from '../../components/courses/CourseCurriculum';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import StudentFeedback from '../../components/courses/StudentFeedback';
import CourseHeader from '../../components/courses/courseHeader';
import api from '../../../infrastructure/api/api';
import Sidebar from '../../components/instructor/Sidebar';
import CourseVideo from '../../components/instructor/CourseVideo';

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Rating' | 'Feedback';

const CourseView = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(typeof(courseId),"id type in video view")
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        if (!courseId) {
          throw new Error('Invalid Course ID.');
        }
        const response = await api.get(`/instructor/course-view/${courseId}`);
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
    <div>
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
    </aside>
    <div className="flex-1 p-6 bg-gray-50">
          <CourseHeader courseTitle={courseData.title} courseSubtitle={courseData.subtitle} instructorId={courseData.instructorId} />
          <CourseVideo id={courseData._id}/>
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
              <CourseCurriculum />
            )}
            {currentSection === 'Rating' && <CourseRating/>}
            {currentSection === 'Feedback' && <StudentFeedback />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
