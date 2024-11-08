import React, { useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { assets } from '../assets/assets_user/assets';

const ProfileDashboard = ({ onSectionChange }) => {
    // State to track the active section
    const [activeSection, setActiveSection] = useState('Dashboard');

    // Function to handle section change and update active section
    const handleSectionChange = (section) => {
        setActiveSection(section);
        onSectionChange(section); // Call the passed callback function
    };

    return (
        <div className="space-y-4">
            {/* User Profile Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Avatar
                        alt="Kevin Gilbert"
                        src={assets.Instructor3} // Replace with user's image path
                        sx={{ width: 100, height: 100 }}
                    />
                    <div>
                        <h2 className="text-xl font-semibold">Kevin Gilbert</h2>
                        <p className="text-gray-500">Web Designer & Best-Selling Instructor</p>
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
                {/* Here you can render dynamic content based on active section */}
            </div>
        </div>
    );
};

export default ProfileDashboard;
