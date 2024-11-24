import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../../../infrastructure/api/api';
import axios from "axios";


function AddCourse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo  = localStorage.getItem('userId');
  // State for course inputs
  const [courseName, setCourseName] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file image frontend",file)
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setImage(file);
    } else {
      toast.error("Invalid file type. Please upload a valid image (JPEG or PNG).");
    }
  };
  
  
  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file Trailer frontend",file)

    if (file && ["video/mp4"].includes(file.type)) {
      setTrailer(file);
    } else {
      toast.error("Please select a trailer Video file(MP4).");
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
      console.log(res,"video data cloud")
      return res.data.url;
    } catch (error) {
      console.error("Error uploading trailer:", error);
      toast.error("Error uploading trailer");
      return "";
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    // Check if all required fields are filled
    if (!courseName || !courseSubtitle || !selectCategory || !courseLanguage || !courseLevel || !courseDuration || !courseDescription) {
        toast.error("Please fill out all required fields.");
        return;
    }
  
    try {
        setLoading(true);
        // Upload image and trailer if provided
        const imageUrl = await submitImage();
        const trailerUrl = await submitTrailer();
  
        // Send the course data to the server
        const courseData = {
            title: courseName,
            subtitle: courseSubtitle,
            category: selectCategory,
            subCategory: "", 
            language: courseLanguage,
            level: courseLevel,
            duration: courseDuration,
            courseFee: courseFee,
            description: courseDescription,
            instructorId: userInfo,
            thumbnail: imageUrl,
            trailer: trailerUrl,
        };
  
        const response = await api.post('/instructor/addCourse', courseData);
        console.log(response,"response");
        console.log(courseData,"courseData")

        toast.success("Course added successfully!");
        navigate("/courses"); // Navigate to courses list or appropriate page
    } catch (error: any) {
        toast.error("Error creating course: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Add New Course</h1>
      <form>
        {/* Course Title */}
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course Name"
        />

        {/* Course Subtitle */}
        <input
          type="text"
          value={courseSubtitle}
          onChange={(e) => setCourseSubtitle(e.target.value)}
          placeholder="Course Subtitle"
        />

        {/* Course Category */}
        <select onChange={(e) => setSelectCategory(e.target.value)} value={selectCategory}>
        <option value="" disabled>Select Category</option>
          {categories.map((category: any) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* Language and Level */}
        <select
  value={courseLanguage}
  onChange={(e) => setCourseLanguage(e.target.value)}
>
<option value="" disabled>Select Language</option>
  <option value="English">English</option>
  <option value="Malayalam">Malayalam</option>
  <option value="Hindi">Hindi</option>
</select>

<select
  value={courseLevel}
  onChange={(e) => setCourseLevel(e.target.value)}
>
<option value="" disabled>Select Level</option>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>


        {/* Duration and Fee */}
        <input
          type="number"
          value={courseDuration}
          onChange={(e) => setCourseDuration(e.target.value)}
          placeholder="Course Duration"
        />
        <input
          type="number"
          value={courseFee}
          onChange={(e) => setCourseFee(e.target.value)}
          placeholder="Course Fee"
        />

        {/* Description */}
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          placeholder="Course Description"
        />

        {/* Image Upload */}
        <input type="file" onChange={handleImageChange} />

        {/* Trailer Upload */}
        <input type="file" onChange={handleTrailerChange} />

        <button type="button" onClick={handleSubmit}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
