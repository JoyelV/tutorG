import React from 'react';
import { FaComment, FaStar, FaBook, FaCheckCircle } from 'react-icons/fa';

const activities = [
  {
    id: 1,
    icon: <FaComment className="text-indigo-500" />,
    user: 'Kevin',
    action: 'commented on',
    activity: '"2021 UI/UX with Figma"',
    time: 'just now',
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-indigo-50',
    textColor: 'text-gray-700',
  },
  {
    id: 2,
    icon: <FaStar className="text-yellow-500" />,
    user: 'John',
    action: 'gave a 5-star rating',
    time: '5 mins ago',
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-indigo-50',
    textColor: 'text-gray-700',
  },
  {
    id: 3,
    icon: <FaBook className="text-green-500" />,
    user: 'Maria',
    action: 'enrolled in',
    activity: '"JavaScript Essentials"',
    time: '15 mins ago',
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-indigo-50',
    textColor: 'text-gray-700',
  },
  {
    id: 4,
    icon: <FaCheckCircle className="text-blue-500" />,
    user: 'David',
    action: 'completed the quiz for',
    activity: '"React Basics"',
    time: '30 mins ago',
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-indigo-50',
    textColor: 'text-gray-700',
  },
];

const ActivityFeed = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className={`flex items-center space-x-3 p-2 rounded-md shadow-sm ${activity.bgColor} ${activity.hoverColor} transition`}
          >
            {activity.icon}
            <span className={activity.textColor}>
              <strong className="text-indigo-600">{activity.user}</strong> {activity.action}{' '}
              {activity.activity && <em>{activity.activity}</em>}{' '}
              <span className="text-sm text-gray-500">{activity.time}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
