import React from 'react';
import { FaComment, FaStar, FaBook, FaCheckCircle, FaShareSquare } from 'react-icons/fa';

const ActivityFeed = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        <li className="flex items-center space-x-3 p-2 bg-white rounded-md shadow-sm hover:bg-indigo-50 transition">
          <FaComment className="text-indigo-500" />
          <span className="text-gray-700">
            <strong className="text-indigo-600">Kevin</strong> commented on <em>"2021 UI/UX with Figma"</em> <span className="text-sm text-gray-500">just now</span>
          </span>
        </li>
        <li className="flex items-center space-x-3 p-2 bg-white rounded-md shadow-sm hover:bg-indigo-50 transition">
          <FaStar className="text-yellow-500" />
          <span className="text-gray-700">
            <strong className="text-indigo-600">John</strong> gave a 5-star rating <span className="text-sm text-gray-500">- 5 mins ago</span>
          </span>
        </li>
        <li className="flex items-center space-x-3 p-2 bg-white rounded-md shadow-sm hover:bg-indigo-50 transition">
          <FaBook className="text-green-500" />
          <span className="text-gray-700">
            <strong className="text-indigo-600">Maria</strong> enrolled in <em>"JavaScript Essentials"</em> <span className="text-sm text-gray-500">- 15 mins ago</span>
          </span>
        </li>
        <li className="flex items-center space-x-3 p-2 bg-white rounded-md shadow-sm hover:bg-indigo-50 transition">
          <FaCheckCircle className="text-blue-500" />
          <span className="text-gray-700">
            <strong className="text-indigo-600">David</strong> completed the quiz for <em>"React Basics"</em> <span className="text-sm text-gray-500">- 30 mins ago</span>
          </span>
        </li>
        <li className="flex items-center space-x-3 p-2 bg-white rounded-md shadow-sm hover:bg-indigo-50 transition">
        </li>
      </ul>
    </div>
  );
};

export default ActivityFeed;
