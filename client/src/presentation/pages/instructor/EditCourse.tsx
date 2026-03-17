import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../../infrastructure/api/courseService";
import axios from "axios";

function EditCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
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
  const [image, setImage] = useState<File | string | null>(null);
  const [trailer, setTrailer] = useState<File | string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    courseName: "",
    courseSubtitle: "",
    selectCategory: "",
    courseLanguage: "",
    courseLevel: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
    courseLearningPoints: "",
    courseTargetAudience: "",
    courseRequirements: "",
    image: "",
    trailer: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchCategories = async () => {
    try {
      const response = await courseService.getCategories();
      const data = response.data.data || response.data;
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(courseId as string);
      const data = response.data.data || response.data;
      const course = data.course || data;

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
      setImage(course.thumbnail);
      setTrailer(course.trailer);

      setImagePreview(course.thumbnail);
      setTrailerPreview(course.trailer);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid file type. Please upload a valid image (JPEG or PNG).");
    }
  };

  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["video/mp4"].includes(file.type)) {
      setTrailer(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTrailerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a trailer video file (MP4).");
    }
  };

  const submitImage = async () => {
    if (!image || typeof image === "string") return image || "";
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
    if (!trailer || typeof trailer === "string") return trailer || "";
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

  const validateForm = () => {
    const newErrors: any = {};
    const alphanumericRegex = /^[a-zA-Z0-9\s\-\:!()&,\.\[\]\/\+]+$/;

    if (!courseName.trim()) newErrors.courseName = "Course name cannot be empty.";
    else if (!alphanumericRegex.test(courseName)) newErrors.courseName = "Course name can only contain letters and numbers.";

    if (!courseSubtitle.trim()) newErrors.courseSubtitle = "Course subtitle cannot be empty.";
    else if (!alphanumericRegex.test(courseSubtitle)) newErrors.courseSubtitle = "Course subtitle can only contain letters and numbers.";

    if (!selectCategory) newErrors.selectCategory = "Please select a course category.";
    if (!courseLanguage) newErrors.courseLanguage = "Please select a course language.";
    if (!courseLevel) newErrors.courseLevel = "Please select a course level.";

    if (!courseDuration || isNaN(Number(courseDuration)) || Number(courseDuration) <= 0)
      newErrors.courseDuration = "Please provide a valid course duration (number > 0).";

    if (!courseFee || isNaN(Number(courseFee)) || Number(courseFee) < 0)
      newErrors.courseFee = "Please provide a valid course fee (non-negative number).";

    if (!alphanumericRegex.test(courseDescription)) newErrors.courseDescription = "Invalid characters in description.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await submitImage();
      const trailerUrl = await submitTrailer();

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
        thumbnail: imageUrl,
        trailer: trailerUrl,
      };

      await courseService.updateCourse(courseId as string, courseData);
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
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-6">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
      <form>
        <div className="mb-4">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={courseSubtitle}
            onChange={(e) => setCourseSubtitle(e.target.value)}
            placeholder="Course Subtitle"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {errors.courseSubtitle && <p className="text-red-500 text-sm">{errors.courseSubtitle}</p>}
        </div>

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

        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium text-gray-700">Course Thumbnail:</label>
          {imagePreview && <img src={imagePreview} alt="Thumbnail Preview" className="mt-2 w-full max-w-sm h-auto object-cover rounded-lg shadow-md" />}
          <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium text-gray-700">Course Trailer:</label>
          {trailerPreview && <video controls className="w-full max-w-lg h-auto p-2 border border-gray-300 rounded-lg shadow-md">
            <source src={trailerPreview} type="video/mp4" />
          </video>}
          <input type="file" accept="video/mp4" onChange={handleTrailerChange} className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/instructor/my-courses")}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
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
  );
}

export default EditCourse;