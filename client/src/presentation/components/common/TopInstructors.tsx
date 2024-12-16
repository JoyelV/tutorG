import { assets } from '../../../assets/assets_user/assets';

interface Instructor {
    name: string;
    title: string;
    category: string;
    image: string;
    rating: string;
    students: string;
}

const instructors: Instructor[] = [
    { name: "Devon Lane", title: "Senior Developer", category: "MACHINE LEARNING", image: assets.Instructor1, rating: "4.6", students: "854" },
    { name: "Jane Smith", title: "Web Developer", category: "WEB DEVELOPMENT", image: assets.Instructor2, rating: "4.8", students: "8K" },
    { name: "Emily Davis", title: "Marketing Expert", category: "MARKETING", image: assets.Instructor3, rating: "4.7", students: "7K" },
    { name: "Albert Flores", title: "Adobe Instructor", category: "DESIGN", image: assets.Instructor4, rating: "5.0", students: "12K" },
    { name: "Kathryn Murphy", title: "Lead Developer", category: "DATA SCIENCE", image: assets.Instructor5, rating: "5.0", students: "12K" },
];

const TopInstructors: React.FC = () => (
    <section className="p-8 bg-white">
        <h3 className="text-2xl font-bold mb-4 text-center">Our Top Instructors</h3>
        <div className="mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {instructors.map((instructor, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                    {/* Instructor Image */}
                    <div
                        className="h-60 bg-cover bg-center rounded-t-xl"
                        style={{ backgroundImage: `url(${instructor.image})` }}
                    ></div>
                    <div className="p-3">
                        {/* Instructor Name and Title */}
                        <h2 className="text-center px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                            {instructor.name}
                        </h2>
                        <p className="text-center text-sm text-gray-500 mb-2">{instructor.title}</p>
                        {/* Students Count */}
                        <div className="flex items-center justify-between text-sm mb-1">
                            <div className="font-bold text-lg text-orange-500">
                                ★ {instructor.rating}
                            </div>
                            <div>
                                <span className="text-gray-500 font-semibold">{instructor.students} students</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default TopInstructors;
