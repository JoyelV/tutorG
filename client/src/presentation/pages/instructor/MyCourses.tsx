import React, { useState, useEffect } from "react";
import Sidebar from "../../components/instructor/Sidebar";
import SearchBar from "../../components/instructor/SearchbBar";
import SortBy from "../../components/instructor/SortBy";
import Filters from "../../components/instructor/Filters";
import CourseCard from "../../components/instructor/CourseCard";
import api from "../../../infrastructure/api/api";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/instructor/DashboardHeader";

interface Course {
    _id: string;
    title: string;
    category: string;
    courseFee: number;
    rating: number;
    students: number;
    thumbnail: string;
}

const MyCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);  
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);  []
    const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get(`/instructor/courses`);
                console.log(response, "response in inst courses")

                setCourses(response.data);
                setFilteredCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const handleEdit = (courseId: string) => {
        navigate(`/instructor/course-edit/${courseId}`);
    };

    const handleDelete = async (courseId: string) => {
        try {
            await api.delete(`/instructor/delete-course/${courseId}`);
            setCourses(courses.filter((course) => course._id !== courseId));
            setFilteredCourses(filteredCourses.filter((course) => course._id !== courseId));
            navigate('/instructor/my-courses');
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleView = (courseId: string) => {
        navigate(`/instructor/course-view/${courseId}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <Sidebar />
            </aside>
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            <DashboardHeader/>
            <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
                <div className="flex items-center justify-between mb-6">
                    <SearchBar onSearch={handleSearch} />
                    <div className="flex items-center gap-4">
                        <SortBy />
                        <Filters />
                    </div>
                </div>
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            courses.map((course) => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    onEdit={() => handleEdit(course._id)}
                                    onDelete={() => handleDelete(course._id)}
                                    onView={() => handleView(course._id)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
