import React from 'react';
import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';

interface Topic {
    name: string;
    courses: string;
    icon: string;
    bgColor: string;
}

const topics: Topic[] = [
    { name: "Business", courses: "8 Courses", icon: assets.Business_icon, bgColor: "#e8f5e9" },
    { name: "Music", courses: "3 Courses", icon: assets.Music_icon, bgColor: "#e3f2fd" },
    { name: "Health & Fitness", courses: "4 Courses", icon: assets.Personal_Development_icon, bgColor: "#fce4ec" },
    { name: "Design", courses: "13 Courses", icon: assets.Finance_icon, bgColor: "#fff3e0" },
    { name: "Lifestyle", courses: "23 Courses", icon: assets.Lifestyle_icon, bgColor: "#fce4ec" },
    { name: "Photography & Video", courses: "3 Courses", icon: assets.Photography_icon, bgColor: "#fff3e0" },
    { name: "Marketing", courses: "4 Courses", icon: assets.Marketing_icon, bgColor: "#eaf7ea" },
    { name: "Label", courses: "7 Courses", icon: assets.logo, bgColor: "#f0eaff" },
];

const Topics: React.FC = () => {
    const navigate = useNavigate();

    const handleBrowseMoreClick = () => {
        navigate('/course-listing'); 
    };

    return (
        <section className="px-8 py-2 bg-white">
            <h3 className="text-2xl font-bold mb-4">Topics recommended for you</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {topics.map((topic, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        style={{ backgroundColor: topic.bgColor }}
                    >
                        <img src={topic.icon} alt={`${topic.name} Icon`} className="w-8 h-8 text-indigo-500 mb-2" />
                        <h4 className="text-gray-900 font-semibold">{topic.name}</h4>
                        <p className="text-gray-500 text-sm">{topic.courses}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center text-center mt-4">
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
