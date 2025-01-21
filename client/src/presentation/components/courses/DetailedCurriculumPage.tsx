import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../infrastructure/api/api';
import { FaChevronDown, FaChevronUp, FaVideo, FaDownload } from 'react-icons/fa';

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

const CurriculumDetailed: React.FC<CurriculumBoxProps> = ({ onLessonSelect }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [curriculum, setCurriculum] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<boolean[]>([]);
  const [videoDurations, setVideoDurations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setIsLoading(true);
        if (!courseId) throw new Error('Invalid Course ID.');

        const response = await api.get(`/user/view-lessons/${courseId}`);
        if (response.status === 200) {
          setCurriculum(response.data);
          setExpandedSections(new Array(response.data.length).fill(false));
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

  const sections = curriculum.map((lesson) => ({
    _id: lesson._id,
    title: lesson.lessonTitle,
    description: lesson.lessonDescription,
    lectures: 1,
    duration: videoDurations[lesson._id] || 'Loading...',
    topics: [
      {
        name: `Watch video: ${lesson.lessonTitle}`,
        duration: videoDurations[lesson._id] || 'Loading...',
        link: lesson.lessonVideo,
        type: 'video',
      },
      {
        name: `Download PDF: ${lesson.lessonTitle}`,
        duration: 'PDF',
        link: lesson.lessonPdf,
        type: 'pdf',
      },
    ],
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="py-4">
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>{sections.length} Sections</span>
            <span>{sections.reduce((acc, sec) => acc + sec.lectures, 0)} lectures</span>
          </div>
          <ul className="space-y-4">
            {sections.map((section, index) => (
              <li key={index} className="border border-gray-200 rounded-lg">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleSection(index)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{section.title}</h3>
                    <div className="text-sm text-gray-500">
                      {section.lectures} lectures • {section.duration}
                    </div>
                  </div>
                  <button className="text-gray-500">
                    {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {expandedSections[index] && section.topics.length > 0 && (
                  <ul className="mt-2 p-4 space-y-2 bg-white">
                    {section.topics.map((topic, i) => (
                      <li key={i} className="flex justify-between text-sm text-gray-600">
                        {topic.type === 'pdf' ? (
                          <button
                            onClick={() => handlePdfDownload(topic.link, `${topic.name}.pdf`)}
                            className="flex items-center space-x-2 hover:underline text-blue-500"
                          >
                            <FaDownload className="text-lg" />
                            <span>Download PDF</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVideoSelect(topic.link)}
                            className="flex items-center space-x-2 hover:underline text-blue-500"
                          >
                            <FaVideo className="text-lg" />
                            <span>Watch Video</span>
                          </button>
                        )}
                        <span>{topic.duration}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailed;