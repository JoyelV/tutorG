import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { grey, orange } from "@mui/material/colors";
import { Facebook, WhatsApp, Twitter } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
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
  faSignal,
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
  const userId = localStorage.getItem("userId");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { message } = response.data;
      if (message === "Student is already enrolled in this course") {
        toast.info(message);
      } else if (message === "Course already exists in the cart") {
        toast.info(message);
      } else {
        toast.success(message);
      }
    } catch (err) {
      toast.error("Login first and then add to cart.");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { message } = response.data;
      if (message === "Course already existed in Wishlist") {
        toast.info(message);
      } else if (message === "Course added to wishlist successfully") {
        toast.success(message);
      }
    } catch (err) {
      toast.error("An error occurred while adding to wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-red-600">₹{courseFee}</p>
        </div>
        <span className="bg-red-200 text-red-700 text-sm font-semibold px-2 py-1 rounded mt-2 md:mt-0">
          56% OFF
        </span>
      </div>
      <p className="text-sm text-red-600 mb-6">⏰ 2 days left at this price!</p>

      <div className="space-y-3 mb-6">
        {/* Responsive course details */}
        {[
          { label: "Course Duration", icon: faClock, value: `${duration} Months` },
          { label: "Course Level", icon: faSignal, value: level },
          { label: "Students Enrolled", icon: faUsers, value: students.length },
          { label: "Language", icon: faLanguage, value: language },
          { label: "Subtitle Language", icon: faClosedCaptioning, value: subtitleLanguage },
        ].map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <p className="text-gray-700 flex items-center">
              <FontAwesomeIcon icon={item.icon} className="mr-2" /> {item.label}
            </p>
            <p className="text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

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

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">This course includes:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            { icon: faInfinity, text: "Lifetime access" },
            { icon: faUndo, text: "30-days money-back guarantee" },
            { icon: faFileDownload, text: "Free exercises file & downloadable resources" },
            { icon: faTrophy, text: "Shareable certificate of completion" },
            { icon: faMobileAlt, text: "Access on mobile, tablet, and TV" },
            { icon: faClosedCaptioning, text: "English subtitles" },
            { icon: faGlobe, text: "100% online course" },
          ].map((item, index) => (
            <li key={index} className="flex items-center">
              <FontAwesomeIcon icon={item.icon} className="mr-2 text-orange-500" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <h3 className="text-sm font-semibold mb-3">Share this course:</h3>
        <div className="flex justify-center gap-2 sm:gap-4">
          {["Facebook", "WhatsApp", "Twitter"].map((platform, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: grey[200],
                "&:hover": { backgroundColor: orange[500] },
                width: 40,
                height: 40,
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
                    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                    : platform === "WhatsApp"
                    ? `https://wa.me/?text=Check out this course: ${encodeURIComponent(url)}`
                    : `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {platform === "Facebook" && <Facebook />}
                {platform === "WhatsApp" && <WhatsApp />}
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