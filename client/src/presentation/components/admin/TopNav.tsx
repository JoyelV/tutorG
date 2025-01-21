import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

const TopNav: React.FC = () => {
  const [admin, setAdmin] = useState<{ username: string; image: string }>({
    username: '',
    image: '',
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get('/admin/profile');
        setAdmin({
          username: response.data.username, 
          image: response.data.image,
        });
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 shadow-md fixed top-0 left-0 right-0 h-16">
      {/* Logo or Branding */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
          AdminPanel
        </Link>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hello, {admin.username || 'Admin'}</span>
        <img
          src={admin.image || '/default-image.jpg'} 
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-200"
        />
      </div>
    </header>
  );
};

export default TopNav;
