import React from 'react';
import { assets } from '../../../assets/assets_user/assets';

interface Course {
  name: string;
  category: string;
  price: string;
  image: string;
  rating: string;
  students: string;
}

const courses: Course[] = [
  { name: "Machine Learning A-Z From Zero To Hero™", category: "DESIGN", price: "₹1299", image: assets.DESIGN, rating: "4.0", students: "6" },
  { name: "How to Learn HTML and CSS With Zero Experience", category: "WEB DEVELOPMENT", price: "₹799", image: assets.LIFESTYLE, rating: "3.5", students: "8" },
  { name: "Advanced SQL - All in 1 SERIES", category: "DATABASE", price: "₹799", image: assets.BUSINESS, rating: "4.3", students: "18" },
  { name: "The Complete Digital Marketing Course", category: "MARKETING", price: "₹499", image: assets.Marketing, rating: "3.8", students: "10" },
  { name: "The Complete Digital Marketing Course", category: "MARKETING", price: "₹499", image: assets.Marketing, rating: "4.2", students: "15" },
];

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "DESIGN":
      return "bg-pink-100 text-pink-600";
    case "WEB DEVELOPMENT":
      return "bg-blue-100 text-blue-600";
    case "DATABASE":
      return "bg-yellow-100 text-yellow-600";
    case "MARKETING":
      return "bg-green-100 text-green-600";
    case "IT & SOFTWARE":
      return "bg-purple-100 text-purple-600";
    case "MUSIC":
      return "bg-teal-100 text-teal-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentlyAddedCourses: React.FC = () => (
  <section className="px-8 py-2 bg-white flex justify-center">
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4">Recently Added Courses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl">
            <div className="h-36 bg-cover bg-center rounded-t-xl" style={{ backgroundImage: `url(${course.image})` }}></div>
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <div className={`${getCategoryColor(course.category)} px-2 py-1 rounded-full text-xs font-semibold uppercase`}>
                  {course.category}
                </div>
                <div className="font-bold text-lg text-green-500">
                  {course.price}
                </div>
              </div>
              <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                {course.name}
              </h2>
              <div className="flex items-center justify-between text-sm mb-1">
                <div><span className="text-yellow-500 font-semibold">★ {course.rating}</span></div>
                <div><span className="text-gray-500 font-semibold">{course.students} students</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RecentlyAddedCourses;
