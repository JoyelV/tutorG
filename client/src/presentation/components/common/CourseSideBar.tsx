import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { toast } from 'react-toastify';
import { grey, orange } from "@mui/material/colors";
import { Facebook, WhatsApp , Twitter } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from 'react-router-dom';
import api from "../../../infrastructure/api/api";
import {
  faClock,
  faClosedCaptioning,
  faInfinity,
  faUndo,
  faFileDownload,
  faTrophy,
  faMobileAlt,
  faGlobe,
  faLanguage,
  faUsers,
  faSignal
} from "@fortawesome/free-solid-svg-icons";

interface CourseSidebarProps {
  course_Id: string;  
  courseFee: number;
  duration: number;
  level: string;
  language: string;
  students: [];
  subtitleLanguage: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseFee,
  duration,
  level,
  language,
  students,
  subtitleLanguage,
}) => {
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const userId = localStorage.getItem('userId');
  const { courseId } = useParams();
  const url = window.location.href;

  const handleAddToCart = async () => {
    setLoadingCart(true); 
  
    try {
      const response = await api.post(
        "/user/cart/add",  
        { courseId, userId },  
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const { message } = response.data;

      if (message === "Student is already enrolled in this course") {
        console.log("Toast info: ", message);
        toast.info(message);
        return;
      }else if(message === "Course already exists in the cart"){
        toast.info(message); 
        return;
      }else{
        toast.success(message);   
      }
    } catch (err) {
      toast.error("An error occurred while adding to cart.");
    } finally {
      setLoadingCart(false); 
    }
  };

  const handleAddToWishlist = async () => {
    setLoadingWishlist(true);  
    
    try {
      const response = await api.post(
        "/user/addtowishlist",  
        { courseId, userId },  
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,  
            "Content-Type": "application/json",  
          },
        }
      );

      const { message } = response.data;

      if (message === "Course already existed in Wishlist") {
        toast.info(message); 
        return;
      }else if(message === "Course added to wishlist successfully"){
        toast.info(message); 
        return;
      }else{
        toast.success(message);   
      }
    } catch (err) {
      toast.error("An error occurred while adding to wishlist.");
    } finally {
      setLoadingWishlist(false); 
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-red-600">₹{courseFee}</p>
        </div>
        <span className="bg-red-200 text-red-700 text-sm font-semibold px-2 py-1 rounded">56% OFF</span>
      </div>
      <p className="text-sm text-red-600 mb-6">⏰ 2 days left at this price!</p>

      {/* Course Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" /> Course Duration
          </p>
          <p className="text-gray-900">{duration} Months</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faSignal} className="mr-2" /> Course Level
          </p>
          <p className="text-gray-900">{level}</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Students Enrolled
          </p>
          <p className="text-gray-900">{students.length}</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faLanguage} className="mr-2" /> Language
          </p>
          <p className="text-gray-900">{language}</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faClosedCaptioning} className="mr-2" /> Subtitle Language
          </p>
          <p className="text-gray-900">{subtitleLanguage}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600"
          disabled={loadingCart}  
        >
          {loadingCart ? "Adding..." : "Add To Cart"}
        </button>
        
        <button
          onClick={handleAddToWishlist}
          className="border border-gray-300 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
          disabled={loadingWishlist}  
        >
          {loadingWishlist ? "Adding..." : "Add To Wishlist"}
        </button>
      </div>

      {/* Course Includes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">This course includes:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <FontAwesomeIcon icon={faInfinity} className="mr-2 text-orange-500" /> Lifetime access
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faUndo} className="mr-2 text-orange-500" /> 30-days money-back guarantee
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faFileDownload} className="mr-2 text-orange-500" /> Free exercises file & downloadable resources
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="mr-2 text-orange-500" /> Shareable certificate of completion
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faMobileAlt} className="mr-2 text-orange-500" /> Access on mobile, tablet, and TV
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faClosedCaptioning} className="mr-2 text-orange-500" /> English subtitles
          </li>
          <li className="flex items-center">
            <FontAwesomeIcon icon={faGlobe} className="mr-2 text-orange-500" /> 100% online course
          </li>
        </ul>
      </div>

       {/* Share Section */}
       <div className="text-center">
        <h3 className="text-sm font-semibold mb-3">Share this course:</h3>
        <div className="flex justify-center gap-4 mb-4">
          {["Facebook", "WhatsApp", "Twitter"].map((platform, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: grey[200],
                "&:hover": { backgroundColor: orange[500] },
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
            >
              <IconButton
                component="a"
                href={
                  platform === "Facebook"
                    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=please share this course`
                    : platform === "WhatsApp"
                    ? `https://wa.me/?text=Check out this course: ${encodeURIComponent(url)}`
                    : `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Enroll in this amazing course for only ₹${courseFee}!`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {platform === "Facebook" && <Facebook />}
                {platform === "WhatsApp" && <WhatsApp  />}
                {platform === "Twitter" && <Twitter />}
              </IconButton>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;