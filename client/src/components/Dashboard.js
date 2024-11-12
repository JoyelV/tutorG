import { assets } from '../assets/assets_user/assets';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const courses = [
    { name: "Machine Learning A-Z From Zero To Hero™", category: "DESIGN", price: "₹499", image: assets.DESIGN},
    { name: "How to Learn HTML and CSS With Zero Experience", category: "WEB DEVELOPMENT", price: "₹700", image: assets.LIFESTYLE},
    { name: "Advanced SQL - All in 1 SERIES", category: "DATABASE", price: "₹800", image: assets.BUSINESS},
    { name: "The Complete Digital Marketing Course", category: "MARKETING", price: "₹800", image: assets.Marketing},
];

const topics = [
    { name: "Enrolled Course", courses: 10, icon: assets.Business_icon ,bgColor: "#e8f5e9"},
    { name: "Active Course", courses: 5, icon: assets.Music_icon ,bgColor: "#e3f2fd"},
    { name: "Completed", courses: 11, icon: assets.Personal_Development_icon,bgColor: "#fce4ec" },
    { name: "Course Instuctors", courses: 3, icon: assets.Finance_icon,bgColor: "#fff3e0" },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem('username'); 

    return (
        <>
            {/* Centering the entire grid and adding horizontal margin */}
                <div className="flex justify-center items-center bg-white px-2">
                    {topics.map((topic, index) => (
                        <div
                        key={index}
                        className="flex items-center justify-between p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                        style={{
                            backgroundColor: topic.bgColor,
                            width: '200px',
                            height: '120px',
                            margin: '0 10px', 
                        }}
                    >
                        {/* Left div for the icon */}
                        <div className="flex items-center justify-center">
                            <img src={topic.icon} alt={`${topic.name} Icon`} className="w-25 h-25 text-indigo-500" />
                        </div>
                        
                        {/* Right div for the content */}
                        <div className="flex flex-col justify-center ml-2">
                            <p className="text-gray-900 font-semibold text-xl">{topic.courses}</p>
                            <p className="text-gray-500 text-sm">{topic.name}</p>
                        </div>
                    </div>
                    
                    ))}
                </div>

            <div className="mt-10 w-full text-3xl font-bold text-black text-center">
                Let’s start learning, {name}
            </div>

            {/* Courses Section */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-10">
                {courses.map((course, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                        <div className="h-48 bg-cover bg-center rounded-t-2xl" style={{ backgroundImage: `url(${course.image})` }}></div>
                        <div className="p-4">
                            <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                                {course.name}
                            </h2>
                            <div className="flex items-center justify-between mb-3">
                                <Button
                                    onClick={() => navigate('/singleCourse')}
                                    variant="contained"
                                    color="warning"
                                    sx={{ fontWeight: 'bold', textTransform: 'none', mt: 2 }}
                                >
                                    Watch Lecture
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Dashboard;
