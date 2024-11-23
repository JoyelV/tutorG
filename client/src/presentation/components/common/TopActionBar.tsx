import React, { useState } from 'react';

const TopActionBar: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Filter');

  const filterOptions: string[] = [
    'All Courses',
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Programming Languages',
    'IT & Software',
    'Personal Development',
    'Business',
  ];

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (option: string) => {
    setSelectedFilter('Filter'); 
    setIsFilterOpen(false);      
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white space-x-4 relative">
      <div className="relative" onMouseLeave={() => setIsFilterOpen(false)}>
        <button
          onClick={toggleFilterDropdown}
          className="flex items-center px-3 py-2 bg-red-100 text-red-500 rounded-md space-x-2"
        >
          {/* Dropdown arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>{selectedFilter}</span>
          <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs ml-1">
            {selectedFilter === 'Filter' ? filterOptions.length : 1}
          </span>
        </button>

        {isFilterOpen && (
          <div className="absolute mt-2 bg-white shadow-md rounded-md w-48 border border-gray-200 z-10">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterSelect(option)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="UI/UX Design"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
      />

      <div className="flex items-center space-x-2 text-sm">
        <span>Sort by:</span>
        <select className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none">
          <option>Trending</option>
          <option>Latest</option>
          <option>Popular</option>
        </select>
      </div>
    </div>
  );
};

export default TopActionBar;
