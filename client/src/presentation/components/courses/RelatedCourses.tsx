import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';

interface Course {
  name: string;
  category: string;
  price: string;
  image: string;
  rating: string;
  students: string;
}

const courses: Course[] = [
  { name: "Machine Learning A-Z From Zero To Hero™", category: "DESIGN", price: "₹499", image: assets.DESIGN, rating: "5.0", students: "265.7K" },
  { name: "How to Learn HTML and CSS With Zero Experience", category: "WEB DEVELOPMENT", price: "₹700", image: assets.LIFESTYLE, rating: "4.5", students: "180K" },
  { name: "Advanced SQL - All in 1 SERIES", category: "DATABASE", price: "₹800", image: assets.BUSINESS, rating: "4.8", students: "200K" },
  { name: "The Complete Digital Marketing Course", category: "MARKETING", price: "₹800", image: assets.Marketing, rating: "4.8", students: "200K" },
  { name: "Reiki Level I, II and Master/Teacher Program", category: "IT & SOFTWARE", price: "₹800", image: assets.Health, rating: "4.8", students: "200K" },
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

const RelatedCourses: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (index: number) => {
    navigate(`/course/details/:${index}`);
  };
  return (
    <>
      <br />
      <h3 className="font-bold text-2xl text-left pl-10">Related Courses</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-10 bg-gradient-to-br from-white to-gray-100">
      {courses.map((course, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
          onClick={() => handleCardClick(index)} 
        >
            <div
              className="h-48 bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${course.image})` }}
            ></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`${getCategoryColor(course.category)} px-2 py-1 rounded-full text-xs font-semibold uppercase`}>
                  {course.category}
                </div>
                <div className="font-bold text-xl text-green-500">
                  {course.price}
                </div>
              </div>
              <h2 className="text-start px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                {course.name}
              </h2>
              <div className="flex items-center justify-between mb-3">
                <div><span className="text-yellow-500 font-semibold mr-1"> ★ {course.rating}</span></div>
                <div><span className="text-right text-gray-500 font-semibold">{course.students} students</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RelatedCourses;
