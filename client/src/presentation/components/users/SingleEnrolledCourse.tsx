import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CourseDescription from '../../components/courses/CourseDescription';
import CourseRating from '../../components/courses/CourseRating';
import CourseRequirements from '../../components/courses/CourseRequirements';
import InstructorInfo from '../../components/courses/InstructorInfo';
import RelatedCourses from '../../components/courses/RelatedCourses';
import StudentFeedback from '../../components/courses/StudentFeedback';
import api from '../../../infrastructure/api/api';
import CourseHeader from './CourseHeader';
import CurriculumBox from '../courses/CourseCurriculumBox';
import CourseVideo from './CourseVideo';

type Section = 'Description' | 'Requirements' | 'Curriculum' | 'Instructor' | 'Rating' | 'Feedback' | 'Quiz';

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentSection, setCurrentSection] = useState<Section>('Description');
  const [courseData, setCourseData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quizError, setQuizError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError('Invalid Course ID.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await api.get(`/user/courses-enrolled/${courseId}`);
        setCourseData(data.course);
        setCompletedLessons(data.completedLessons);
        setTotalLessons(data.totalLessons);
        setSelectedVideoUrl(data.course.trailer);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course data.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchQuizData = async () => {
      try {
        const { data } = await api.get(`/user/quizzes/${courseId}`);
        console.log(data, "quizdata");
        setQuizData(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setQuizError(err.message || 'Failed to fetch quiz data.');
        setQuizData([]);
      }
    };

    fetchCourseData();
    fetchQuizData();
  }, [courseId]);


  const handleSectionChange = (section: Section) => setCurrentSection(section);

  const handleQuizSubmit = async () => {
    if (isSubmitting) return;
    if (Object.keys(selectedOptions).length === 0) {
      toast.error('Please select answers before submitting!');
      return;
    }

    setIsSubmitting(true);

    const answers = Object.entries(selectedOptions).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    try {
      const { data } = await api.post('/user/quizzes/attempt', { quizId: quizData[0]._id, answers });
      const { score, totalQuestions, correctAnswers } = data;
      toast.success(
        `Quiz submitted! Your score: ${score}/${totalQuestions}. Correct answers: ${correctAnswers}/${totalQuestions}`
      );
      setSelectedOptions({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:w-2/3 w-full p-6">
          <CourseHeader
            courseTitle={courseData.title}
            courseSubtitle={courseData.subtitle}
            instructorId={courseData.instructorId}
          />

          <CourseVideo videoUrl={selectedVideoUrl} id={courseId!} lesson={lessonId} />

          <div className="flex justify-between items-center mt-4">
            <h2 className="text-2xl font-bold">{courseData.title}</h2>
            {/* Download Certificate Button */}
            {completedLessons === totalLessons && totalLessons > 0 && (
              <Link
                to={`/completion-certificate/${courseId}`}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
              >
                Download Certificate
              </Link>
            )}
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            {['Description', 'Requirements', 'Instructor', 'Rating', 'Feedback', 'Quiz'].map((section) => (
              <button
                key={section}
                className={`text-lg py-2 px-4 transition-all duration-300 ${currentSection === section
                  ? 'font-bold border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-blue-500'}`}
                onClick={() => handleSectionChange(section as Section)}
              >
                {section}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '300px' }}>
            {currentSection === 'Description' && <CourseDescription {...courseData} />}
            {currentSection === 'Requirements' && <CourseRequirements requirements={courseData.requirements} />}
            {currentSection === 'Instructor' && <InstructorInfo instructorId={courseData.instructorId} />}
            {currentSection === 'Rating' && <CourseRating courseId={courseId!} />}
            {currentSection === 'Feedback' && <StudentFeedback />}
            {currentSection === 'Quiz' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Quiz Section</h2>
                {quizData && quizData.length > 0 ? (
                  quizData.map((quiz) => (
                    <div key={quiz._id} className="mb-6">
                      {quiz.questions.map((question: any) => (
                        <div key={question._id}>
                          <p className="font-semibold">{question.question}</p>
                          {question.options.map((option: string) => (
                            <div key={option} className="mb-2">
                              <input
                                type="radio"
                                id={`${quiz._id}-${question._id}-${option}`}
                                name={`quiz-${quiz._id}-${question._id}`}
                                value={option}
                                checked={selectedOptions[question._id] === option}
                                onChange={() => handleOptionChange(question._id, option)}
                              />
                              <label htmlFor={`${quiz._id}-${question._id}-${option}`} className="ml-2">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ))}
                      <button
                        onClick={handleQuizSubmit}
                        disabled={isSubmitting}
                        className={`bg-blue-500 text-white py-2 px-4 mt-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                      </button>

                    </div>
                  ))
                ) : (
                  <p>No quizzes available for this course.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3 w-full bg-gray-50 p-6 shadow-md hidden md:block">
          {/* Course Progress UI */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full text-right"
                style={{ width: `${progressPercentage}%` }}
              >
                <span className="text-xs text-white pr-2">{progressPercentage}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedLessons} out of {totalLessons} lessons completed
            </p>
          </div>
          <CurriculumBox onLessonSelect={setSelectedVideoUrl} onlessonId={setLessonId} />
        </div>
      </div>
      <RelatedCourses />
    </div>
  );
};

export default CoursePage;
