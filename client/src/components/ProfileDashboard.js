import React, { useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { assets } from '../assets/assets_user/assets';

const ProfileDashboard = ({ onSectionChange }) => {
    const [activeSection, setActiveSection] = useState('Dashboard');
    const name = localStorage.getItem('username'); 
    const role = localStorage.getItem('role'); 

    const handleSectionChange = (section) => {
        setActiveSection(section);
        onSectionChange(section); 
    };

    return (
        <div className="space-y-4">
            {/* User Profile Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Avatar
                        alt="{{name}}"
                        src={assets.Instructor3} 
                        sx={{ width: 100, height: 100 }}
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{name}</h2>
                        <p className="text-gray-500">{role}</p>
                    </div>
                </div>
                <Button variant="contained" color="warning">
                    Become Instructor 
                </Button>
            </div>

            {/* Profile Navigation Section */}
            <div className="flex space-x-8 border-b-2 pb-4">
                {['Dashboard', 'Courses', 'Teachers', 'Message', 'Wishlist', 'Purchase History', 'Settings'].map((section) => (
                    <div
                        key={section}
                        onClick={() => handleSectionChange(section)}
                        className={`cursor-pointer ${activeSection === section ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                    >
                        {section}
                    </div>
                ))}
            </div>

            {/* Section content */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">{activeSection}</h3>
                {/* Here render dynamic content based on active section */}
            </div>
        </div>
    );
};

export default ProfileDashboard;
