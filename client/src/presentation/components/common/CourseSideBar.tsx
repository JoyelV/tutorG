import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { grey, orange } from "@mui/material/colors";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSignal,
  faUsers,
  faLanguage,
  faClosedCaptioning,
  faInfinity,
  faUndo,
  faFileDownload,
  faTrophy,
  faMobileAlt,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const CourseSidebar: React.FC = () => {
  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {/* Price Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-red-600">₹1314.00</p>
          <p className="text-sm text-gray-500 line-through">₹26.00</p>
        </div>
        <span className="bg-red-200 text-red-700 text-sm font-semibold px-2 py-1 rounded">56% OFF</span>
      </div>
      <p className="text-sm text-red-600 mb-6">
        ⏰ 2 days left at this price!
      </p>

      {/* Course Information Section */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" /> Course Duration
          </p>
          <p className="text-gray-900">6 Months</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faSignal} className="mr-2" /> Course Level
          </p>
          <p className="text-gray-900">Beginner and Intermediate</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Students Enrolled
          </p>
          <p className="text-gray-900">69,419,618</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faLanguage} className="mr-2" /> Language
          </p>
          <p className="text-gray-900">Mandarin</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faClosedCaptioning} className="mr-2" /> Subtitle Language
          </p>
          <p className="text-gray-900">English</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button className="bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600">
          Add To Cart
        </button>
        <button className="bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600">
          Buy Now
        </button>
        <button className="border border-gray-300 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100">
          Add To Wishlist
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mb-6">
        Note: all courses have a 30-days money-back guarantee
      </p>

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
        <div className="flex justify-center gap-4">
          {["Facebook", "Instagram", "LinkedIn", "Twitter"].map((platform, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: grey[200],
                '&:hover': { backgroundColor: orange[500] },
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <IconButton
                sx={{ color: grey[700], p: 0 }}
              >
                {platform === "Facebook" && <Facebook />}
                {platform === "Instagram" && <Instagram />}
                {platform === "LinkedIn" && <LinkedIn />}
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
