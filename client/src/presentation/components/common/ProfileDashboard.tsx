import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { Section } from '../../pages/user/userProfile';
import api from '../../../infrastructure/api/api';
import { assets } from '../../../assets/assets_user/assets';

type ProfileDashboardProps = {
  onSectionChange: (section: Section) => void;
};

const ProfileDashboard = ({ onSectionChange }: ProfileDashboardProps) => {
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [userImage, setUserImage] = useState<string>('');
  const name = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role') || 'User';

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await api.get('/user/image');
        setUserImage(response.data.imageUrl); 
      } catch (error) {
        console.error('Error fetching user image:', error);
      }
    };
    fetchUserImage();
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    onSectionChange(section as Section);
  };

  return (
    <div className="space-y-2 p-2 md:p-3">
      {/* User Profile Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar
            alt={name}
            src={userImage || assets.Instructor1}
            sx={{ width: { xs: 44, sm: 50, md: 60 }, height: { xs: 44, sm: 50, md: 60 } }}
          />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
            <p className="text-sm sm:text-base text-gray-500">{role}</p>
          </div>
        </div>
      </div>
      {/* Profile Navigation Section */}
      <div className="flex flex-wrap gap-4 border-b-2 pb-4">
        {['Dashboard', 'Courses', 'Teachers', 'Message', 'Wishlist', 'Purchase History', 'Settings'].map((section) => (
          <div
            key={section}
            onClick={() => handleSectionClick(section)}
            className={`cursor-pointer ${
              activeSection === section ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            {section}
          </div>
        ))}
      </div>
      {/* Section Content */}
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-semibold">{activeSection}</h3>
      </div>
    </div>
  );  
};

export default ProfileDashboard;
