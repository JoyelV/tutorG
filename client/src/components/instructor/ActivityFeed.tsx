import React from 'react';

const ActivityFeed = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <ul className="space-y-2 mt-4">
        <li>Kevin commented on "2021 UI/UX with Figma" just now</li>
        <li>John gave a 5-star rating - 5 mins ago</li>
        {/* Add more items as per design */}
      </ul>
    </div>
  );
};

export default ActivityFeed;
