import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import StudentFeedback from '../../components/courses/StudentFeedback';
import api from '../../../infrastructure/api/api';
import CourseVideo from '../../components/admin/CourseVideo';
import Sidebar from '../../components/admin/Sidebar';
import CurriculumBox from '../../components/courses/CourseCurriculumBox';
import CourseHeader from '../../components/admin/CourseHeader';

type Section = 'Description' | 'Requirements' | 'Feedback' | 'Reviews';

const CourseViewPage = () => {
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseStatus, setCourseStatus] = useState(''); 
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        if (!courseId) {
          throw new Error('Invalid Course ID.');
        }
        const [courseResponse, reviewsResponse] = await Promise.all([
          api.get(`/admin/courseDetailview/${courseId}`),
          api.get(`/admin/reviews/${courseId}`),
        ]);

        if (courseResponse.status === 200) {
          setCourseData(courseResponse.data);
          setCourseStatus(courseResponse.data.status); 
          setSelectedVideoUrl(courseResponse.data.trailer)
        } else {
          throw new Error('Course not found.');
        }

        if (reviewsResponse.status === 200) {
          setReviews(reviewsResponse.data);
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

  const handleAddReview = () => {
    navigate(`/admin/addReview/${courseId}`);
  };

  const updateCourseStatus = async (newStatus: string) => {
    try {
      const response = await api.put(`/admin/${newStatus}/${courseId}`);
      if (response.status === 200) {
        setCourseStatus(newStatus); 
      } else {
        throw new Error('Failed to update status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status.');
    }
  };

  const handlePublish = () => {
    updateCourseStatus('publish');
  };

  const handleReject = () => {
    updateCourseStatus('reject');
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
          <CourseVideo videoUrl={selectedVideoUrl} />

            {/* Section Navigation */}
            <div className="flex border-b border-gray-200 mt-6 mb-6">
              {['Description', 'Requirements', 'Feedback', 'Reviews'].map((section) => (
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

              {currentSection === 'Feedback' && <StudentFeedback />}
              {currentSection === 'Reviews' && (
                <div>
                  {reviews.length === 0 ? (
                    <p>No reviews available for this course.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="border p-4 rounded mb-4 shadow-sm">
                        <h4 className="font-bold text-gray-800">{review.title}</h4>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-gray-400 text-xs">
                          Added on {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
              
            </div>
          </div>

          {/* Right Content - Curriculum */}
          <div className="w-1/3 bg-white shadow-lg p-2 flex flex-col gap-4">
            <button
              onClick={handleAddReview}
              className="px-4 py-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
            >
              Add Review
            </button>
                {courseStatus === 'reviewed' && (
                  <div className="flex gap-4">
                    <button
                      onClick={handlePublish}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Publish
                    </button>
                    <button
                      onClick={handleReject}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {courseStatus === 'published' && (
                  <button
                    disabled
                    className="bg-green-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
                  >
                    Published
                  </button>
                )}
                {courseStatus === 'rejected' && (
                  <button
                    disabled
                    className="bg-red-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
                  >
                    Rejected
                  </button>
                )}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Curriculum</h3>
            <CurriculumBox
              onLessonSelect={(videoUrl) => setSelectedVideoUrl(videoUrl)}
            />          
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
