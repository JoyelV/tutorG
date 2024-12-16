import React, { useState, useEffect } from 'react';
import ImageCard from '../../components/users/ImageCard';
import api from '../../../infrastructure/api/api';
import Navbar from '../../components/common/Navbar';

const ViewCoursesListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All Courses');
  const [sortOption, setSortOption] = useState<string>('Trending');
  const [filterOptions, setFilterOptions] = useState<string[]>(['All Courses']);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories');
        const categories = response.data.map((category: any) => category.categoryName);
        setFilterOptions(['All Courses', ...categories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div>
      {/* Top Action Bar */}
      <Navbar />
      <div className="flex items-center justify-between px-6 py-4 bg-white space-x-4 relative">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center px-3 py-2 bg-red-100 text-red-500 rounded-md"
            onClick={toggleDropdown}
          >
            <span>{selectedFilter}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 bg-white shadow-md rounded-md w-48 border border-white z-10">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-white"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search course name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 text-sm">
          <span>Sort by:</span>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option>Latest</option>
            <option>Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ImageCard
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          sortOption={sortOption}
        />
      </div>
    </div>
  );
};

export default ViewCoursesListing;
