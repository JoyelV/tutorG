import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../../../infrastructure/api/api';
import axios from "axios";

function AddCourse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Array<{ _id: string; categoryName: string }>>([]);
  const [loading, setLoading] = useState(false);
  const userInfo = localStorage.getItem('userId');

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
  const [errors, setnewErrors] = useState({
    courseName: "",
    courseSubtitle: "",
    selectCategory: "",
    courseLanguage: "",
    courseLevel: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
    courseRequirements: "",
    courseLearningPoints: "",
    courseTargetAudience: "",
    image: "",
    trailer: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/instructor/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setnewErrors((prev) => ({ ...prev, image: "Only JPEG or PNG images are allowed." }));
        return;
      }
      setImage(file);
      setnewErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "video/mp4") {
        setnewErrors((prev) => ({ ...prev, trailer: "Only MP4 videos are allowed." }));
        return;
      }
      setTrailer(file);
      setnewErrors((prev) => ({ ...prev, trailer: "" }));
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

  const validateForm = () => {
    const newErrors: any = {};
  
    const alphanumericRegex = /^[a-zA-Z0-9\s\-:!()&,.]+$/;
  
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
    
    if (!alphanumericRegex.test(courseDescription)) newErrors.courseDescription = "Course description can only contain letters and numbers.";
    if (!alphanumericRegex.test(courseRequirements)) newErrors.courseRequirements = "Course requirements can only contain letters and numbers.";
    if (!alphanumericRegex.test(courseLearningPoints)) newErrors.courseLearningPoints = "Course learning points can only contain letters and numbers.";
    if (!alphanumericRegex.test(courseTargetAudience)) newErrors.courseTargetAudience = "Target audience can only contain letters and numbers.";
    
    if (!image) newErrors.image = "Please upload a course thumbnail image.";
    if (!trailer) newErrors.trailer = "Please upload a course trailer video.";
  
    setnewErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

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

      const response = await api.post('/instructor/addCourse', courseData);
      toast.success("Course added successfully!");
      const courseId = response.data.courseId;
      navigate(`/instructor/add-lesson/${courseId}`);
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
        <form>
          {/* Course Name */}
          <div className="mb-4">
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course Name"
              className={`w-full p-3 border ${errors.courseName ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
            {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}
          </div>
          {/* Course Subtitle */}
          <div className="mb-4">
            <input
              type="text"
              value={courseSubtitle}
              onChange={(e) => setCourseSubtitle(e.target.value)}
              placeholder="Course Subtitle"
              className={`w-full p-3 border 
            ${errors.courseSubtitle ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseSubtitle && <p className="text-red-500 text-sm">{errors.courseSubtitle}</p>}
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
          {errors.selectCategory && <p className="text-red-500 text-sm">{errors.selectCategory}</p>}
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
              className="w-full p-3 border border-gray-300 rounded-lg">
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
              className={`w-full p-3 border 
              ${errors.courseDuration ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
            <input
              type="number"
              value={courseFee}
              onChange={(e) => setCourseFee(e.target.value)}
              placeholder="Course Fee"
              className={`w-full p-3 border 
              ${errors.courseFee ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseFee && <p className="text-red-500 text-sm">{errors.courseFee}</p>}
          {/* Description */}
          <div className="mb-4">
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Course Description"
              className={`w-full p-3 border 
              ${errors.courseDescription ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseDescription && <p className="text-red-500 text-sm">{errors.courseDescription}</p>}

          <div className="mb-4">
            <textarea
              value={courseRequirements}
              onChange={(e) => setCourseRequirements(e.target.value)}
              placeholder="Course Requirements"
              className={`w-full p-3 border 
              ${errors.courseRequirements ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseRequirements && <p className="text-red-500 text-sm">{errors.courseRequirements}</p>}
          <div className="mb-4">
            <textarea
              value={courseTargetAudience}
              onChange={(e) => setCourseTargetAudience(e.target.value)}
              placeholder="Course Target Audience"
              className={`w-full p-3 border 
              ${errors.courseTargetAudience ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseTargetAudience && <p className="text-red-500 text-sm">{errors.courseTargetAudience}</p>}
          <div className="mb-4">
            <textarea
              value={courseLearningPoints}
              onChange={(e) => setCourseLearningPoints(e.target.value)}
              placeholder="Course Learning Points"
              className={`w-full p-3 border 
              ${errors.courseLearningPoints ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
            />
          </div>
          {errors.courseLearningPoints && <p className="text-red-500 text-sm">{errors.courseLearningPoints}</p>}
          {/* Image Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}


          {/* Trailer Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleTrailerChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          {errors.trailer && <p className="text-red-500 text-sm">{errors.trailer}</p>}

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
