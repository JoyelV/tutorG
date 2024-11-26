// CourseCurriculum.tsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const sections = [
  {
    title: 'Getting Started',
    lectures: 4,
    duration: '51m',
    topics: [
      { name: "What's is Webflow?", duration: '07:31' },
      { name: 'Sign up in Webflow', duration: '07:31' },
      { name: 'Webflow Terms & Conditions', duration: '5.3 MB' },
      { name: 'Teaser of Webflow', duration: '07:31' },
      { name: 'Assessment Test', duration: '5.3 MB' },
    ],
  },
  { title: 'Secret of Good Design', lectures: 52, duration: '5h 49m', topics: [] },
  { title: 'Practice Design Like an Artist', lectures: 43, duration: '53m', topics: [] },
  { title: 'Web Development (webflow)', lectures: 137, duration: '10h 6m', topics: [] },
  { title: 'Secrets of Making Money Freelancing', lectures: 21, duration: '38m', topics: [] },
  { title: 'Advanced', lectures: 39, duration: '91m', topics: [] },
];

const CourseCurriculumBox: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
<div className="py-4">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Curriculum</h2>
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>6 Sections</span>
        <span>202 lectures</span>
        <span>19h 37m</span>
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
                    <span>{topic.name}</span>
                    <span>{topic.duration}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseCurriculumBox;
