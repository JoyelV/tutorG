import React, { useEffect, useState } from 'react';
import ImageCard from '../../components/users/ImageCard';
import Navbar from '../../components/common/Navbar';
import api from '../../../infrastructure/api/api';

const ViewCoursesListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All Courses');
  const [sortOption, setSortOption] = useState<string>('Trending');
  const [categories, setCategories] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/user/categories');
      const categoryNames = response.data.map((category: any) => category.categoryName);
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-between px-6 py-4 bg-white space-x-4 relative">
        <input
          type="text"
          placeholder="Search course name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />

        <div className="flex items-center space-x-2 text-sm">
          <span>Category:</span>
          <select
            value={selectedFilter}
            onChange={handleFilterSelect}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="All Courses">All Courses</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

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

      <div className="min-h-[50vh] flex flex-col items-center justify-center">
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
