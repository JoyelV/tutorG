import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../infrastructure/api/api';
import { FaTv } from 'react-icons/fa';

interface Lesson {
  _id: string;
  lessonTitle: string;
  lessonDescription: string;
  lessonVideo: string;
  courseId: string;
  createdAt: string;
}

interface CurriculumBoxProps {
  onLessonSelect: (videoUrl: string) => void;
}

const CurriculumDetailed: React.FC<CurriculumBoxProps> = ({ onLessonSelect }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [curriculum, setCurriculum] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoDurations, setVideoDurations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setIsLoading(true);
        if (!courseId) throw new Error('Invalid Course ID.');

        const response = await api.get(`/user/view-lessons/${courseId}`);
        if (response.status === 200) {
          setCurriculum(response.data);
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

  const loadVideoDuration = (videoUrl: string, lessonId: string) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      const formattedDuration = new Date(duration * 1000).toISOString().substr(11, 8); // HH:mm:ss format
      setVideoDurations((prev) => ({ ...prev, [lessonId]: formattedDuration }));
    });
  };

  useEffect(() => {
    curriculum.forEach((lesson) => {
      if (lesson.lessonVideo && !videoDurations[lesson._id]) {
        loadVideoDuration(lesson.lessonVideo, lesson._id);
      }
    });
  }, [curriculum]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
        <span className="ml-3 text-xl">Loading Lesson Details...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex bg-white">
      <div className="flex-1">
        <div className="py-0">
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>{curriculum.length} Lessons</span>
          </div>
          <ul className="space-y-4">
            {curriculum.map((lesson) => (
              <li
                key={lesson._id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center space-x-4">
                <FaTv className="text-lg" /> 
                  <span className="text-gray-800 font-semibold">{lesson.lessonTitle}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {videoDurations[lesson._id] || 'Loading...'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailed;
