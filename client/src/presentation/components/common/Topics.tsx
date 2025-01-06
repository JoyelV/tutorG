import React, { useEffect, useState } from 'react';
import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface SubCategory {
  name: string;
}

interface Category {
  categoryName: string;
  subCategories: SubCategory[];
  createdByAdmin: boolean;
  status: boolean;
}

const iconMapping: Record<string, string> = {
  DATABASE: assets.Business_icon,
  "PROTOTYPE DESIGN": assets.Music_icon,
  "Full stack development": assets.Personal_Development_icon,
  Photography: assets.Finance_icon,
  "Office skills": assets.Lifestyle_icon,
  "Photography & Video": assets.Photography_icon,
  Studio: assets.Marketing_icon,
  "Automated testing": assets.Business_icon,
  "Film Making": assets.Finance_icon,
  "Web development": assets.Personal_Development_icon,
  "Data Science": assets.FlyingLogo,
  "Personnel development": assets.Personal_Development_icon,
  Painting: assets.Photography_icon,
  "Content creation": assets.Marketing_icon,
  "Machine Learning": assets.Photography_icon,
  Default: assets.logo, 
};

const Topics: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/user/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleBrowseMoreClick = () => {
    navigate('/course-listing');
  };

  return (
    <section className="px-4 md:px-8 py-4 bg-white">
      <h3 className="text-2xl font-bold mb-4 text-center">Topics Recommended for You</h3>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.slice(0, 12).map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#fce4ec' }}
            >
              <img
                src={iconMapping[category.categoryName] || iconMapping.Default}
                alt={`${category.categoryName} Icon`}
                className="w-12 h-12 mb-2"
              />
              <h4 className="text-gray-900 font-semibold text-center">{category.categoryName}</h4>
              <p className="text-gray-500 text-sm">{`${category.subCategories.length} Subcategories`}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center text-center mt-6">
        <p className="text-gray-600 mb-2">We have more categories & subcategories.</p>
        <button
          onClick={handleBrowseMoreClick}
          className="flex items-center gap-2 bg-white px-8 py-2 rounded-full text-orange-500 text-sm hover:scale-105 transition-all duration-300"
        >
          Browse More
          <img className="w-3" src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      </div>
    </section>
  );
};

export default Topics;
