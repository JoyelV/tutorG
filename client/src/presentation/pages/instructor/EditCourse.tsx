import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../infrastructure/api/api";
import axios from "axios";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";

function EditCourse() {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = localStorage.getItem("userId");

  const [courseName, setCourseName] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseRequirements, setCourseRequirements] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseLearningPoints, setCourseLearningPoints] = useState("");
  const [courseTargetAudience, setCourseTargetAudience] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/courses/${courseId}`);
      const course = response.data;
      setCourseName(course.title);
      setCourseSubtitle(course.subtitle);
      setSelectCategory(course.category);
      setCourseLanguage(course.language);
      setCourseLevel(course.level);
      setCourseDuration(course.duration);
      setCourseRequirements(course.requirements);
      setCourseFee(course.courseFee);
      setCourseLearningPoints(course.learningPoints);
      setCourseTargetAudience(course.targetAudience);
      setCourseDescription(course.description);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      toast.error("Error loading course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setImage(file);
    } else {
      toast.error("Invalid file type. Please upload a valid image (JPEG or PNG).");
    }
  };

  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["video/mp4"].includes(file.type)) {
      setTrailer(file);
    } else {
      toast.error("Please select a trailer video file (MP4).");
    }
  };

  const submitImage = async () => {
    if (!image) return "";
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dazdngh4i");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dazdngh4i/image/upload",
        formData
      );
      return res.data.url;
    } catch (error: any) {
      console.error("Cloudinary error:", error.response?.data || error.message);
      toast.error(`Error uploading image: ${error.response?.data?.message || error.message}`);
      return "";
    }
  };

  const submitTrailer = async () => {
    if (!trailer) return "";
    const formData = new FormData();
    formData.append("file", trailer);
    formData.append("upload_preset", "videos_preset");
    formData.append("cloud_name", "dazdngh4i");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dazdngh4i/video/upload",
        formData
      );
      return res.data.url;
    } catch (error) {
      console.error("Error uploading trailer:", error);
      toast.error("Error uploading trailer");
      return "";
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!courseName || !courseSubtitle || !selectCategory || !courseLanguage || !courseLevel || !courseDuration || !courseDescription || !courseLearningPoints || !courseTargetAudience) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = image ? await submitImage() : null;
      const trailerUrl = trailer ? await submitTrailer() : null;

      const courseData = {
        title: courseName,
        subtitle: courseSubtitle,
        category: selectCategory,
        language: courseLanguage,
        level: courseLevel,
        duration: courseDuration,
        courseFee: courseFee,
        description: courseDescription,
        requirements: courseRequirements,
        learningPoints: courseLearningPoints,
        targetAudience: courseTargetAudience,
        instructorId: userInfo,
        ...(imageUrl && { thumbnail: imageUrl }),
        ...(trailerUrl && { trailer: trailerUrl }),
      };
      console.log(courseData,"data in editcourse")

      const response = await api.put(`/instructor/course/${courseId}`, courseData);
      console.log(courseId,"id");
      console.log(response,"editedcoursedata.....")
      toast.success("Course updated successfully!");
      navigate(`/instructor/course-view/${courseId}`);
    } catch (error: any) {
      console.error("Error updating course:", error.message);
      toast.error("Error updating course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
    </aside>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <DashboardHeader/>
        <section>
        <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
        <form>
          {/* Form Fields */}
          <div className="mb-4">
          {/* Course Name */}
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Course Subtitle */}
        <div className="mb-4">
          <input
            type="text"
            value={courseSubtitle}
            onChange={(e) => setCourseSubtitle(e.target.value)}
            placeholder="Course Subtitle"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Course Category */}
        <div className="mb-4">
          <select
            onChange={(e) => setSelectCategory(e.target.value)}
            value={selectCategory}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Language and Level */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <select
            value={courseLanguage}
            onChange={(e) => setCourseLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Select Language</option>
            <option value="English">English</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Hindi">Hindi</option>
          </select>

          <select
            value={courseLevel}
            onChange={(e) => setCourseLevel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Duration and Fee */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <input
            type="number"
            value={courseDuration}
            onChange={(e) => setCourseDuration(e.target.value)}
            placeholder="Course Duration"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            value={courseFee}
            onChange={(e) => setCourseFee(e.target.value)}
            placeholder="Course Fee"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Course Description"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <textarea
            value={courseRequirements}
            onChange={(e) => setCourseRequirements(e.target.value)}
            placeholder="Course Requirements"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <textarea
            value={courseTargetAudience}
            onChange={(e) => setCourseTargetAudience(e.target.value)}
            placeholder="Course Target Audience"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <textarea
            value={courseLearningPoints}
            onChange={(e) => setCourseLearningPoints(e.target.value)}
            placeholder="Course Learning Points"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Trailer Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleTrailerChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? "Editing..." : "Edit Course"}
          </button>
        </div>
      </form>
      </div>
      </div>
      </section>
      </div>
      </div>
  );
}

export default EditCourse;
