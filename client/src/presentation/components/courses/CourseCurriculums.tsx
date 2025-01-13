import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../infrastructure/api/api';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface Lesson {
  _id: string;
  lessonTitle: string;
  lessonDescription: string;
  lessonVideo: string;
  lessonPdf: string;
  courseId: string;
  createdAt: string;
}

interface CurriculumBoxProps {
  onLessonSelect: (videoUrl: string) => void;
}

const CurriculumPage: React.FC<CurriculumBoxProps> = ({ onLessonSelect }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [curriculum, setCurriculum] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<boolean[]>([]);
  const [showFullDescription, setShowFullDescription] = useState<boolean[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setIsLoading(true);
        if (!courseId) throw new Error('Invalid Course ID.');

        const response = await api.get(`/instructor/view-lessons/${courseId}`);
        if (response.status === 200) {
          setCurriculum(response.data);
          setExpandedSections(new Array(response.data.length).fill(false));
          setShowFullDescription(new Array(response.data.length).fill(false));
        } else {
          throw new Error('Curriculum not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch curriculum.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculum();
  }, [courseId]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const toggleDescription = (index: number) => {
    setShowFullDescription((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handlePdfDownload = (pdfUrl: string, pdfTitle: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfTitle;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVideoSelect = (videoUrl: string) => {
    if (onLessonSelect) {
      onLessonSelect(videoUrl); 
    }
  };

  const handleEditLesson = (lessonId: string) => {
    navigate(`/instructor/edit-lesson/${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the lesson permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await api.delete(`/instructor/delete-lesson`, {
          data: { lessonId },
        });
        if (response.status === 200) {
          setCurriculum((prev) => prev.filter((lesson) => lesson._id !== lessonId));
          Swal.fire('Deleted!', 'Lesson has been deleted.', 'success');
        } else {
          throw new Error(response.data.message || 'Failed to delete the lesson.');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete the lesson.', 'error');
      }
    }
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Curriculum</h2>
        <ul className="space-y-4">
          {curriculum.map((lesson, index) => (
            <li key={lesson._id} className="border border-gray-200 rounded-lg">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleSection(index)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{lesson.lessonTitle}</h3>
                  <div className="text-sm text-gray-500">
                    {showFullDescription[index]
                      ? lesson.lessonDescription
                      : `${lesson.lessonDescription.slice(0, 10)}... `}
                    <button
                      className="text-blue-500 hover:underline ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDescription(index);
                      }}
                    >
                      {showFullDescription[index] ? 'Less' : 'More'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLesson(lesson._id);
                    }}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLesson(lesson._id);
                    }}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <button className="text-gray-500">
                    {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
              {expandedSections[index] && (
                <ul className="mt-2 p-4 space-y-2 bg-white">
                  <li>
                    <button
                      onClick={() => handleVideoSelect(lesson.lessonVideo)}
                      className="hover:underline text-blue-500"
                    >
                      Watch Video
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePdfDownload(lesson.lessonPdf, lesson.lessonTitle)}
                      className="hover:underline text-blue-500"
                    >
                      Download PDF
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurriculumPage;
