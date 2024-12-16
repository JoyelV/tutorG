import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HeroSection from "../../components/common/HeroSection";
import { assets } from "../../../assets/assets_user/assets";

const ContactPage = () => {
  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Branches Section */}
      <section className="container mx-auto px-4 my-12 bg-white">
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-10">
          Our Branches All Over the World
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cards */}
          {[
            {
              title: "Los Angeles",
              subtitle: "California",
              address: "Santa Monica, CA 90404",
              image: assets.Branches,
            },
            {
              title: "Tokyo",
              subtitle: "Japan",
              address: "Shibuya, Tokyo",
              image: assets.Branches2,
            },
            {
              title: "Moscow",
              subtitle: "Russia",
              address: "Arbat Street, Moscow",
              image: assets.Branches3,
            },
            {
              title: "Mumbai",
              subtitle: "India",
              address: "Gateway of India",
              image: assets.Branches4,
            },
          ].map((branch, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg group h-64 cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${branch.image})` }}
              ></div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-500"></div>

              {/* Text Content */}
              <div className="absolute bottom-4 left-0 w-full text-center text-white px-4">
                <h3 className="text-xl font-bold drop-shadow-md">{branch.title}</h3>
                <p className="text-sm">{branch.subtitle}</p>
                <p className="text-xs mt-1">{branch.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="flex justify-center items-center w-full min-h-[60vh] bg-white px-6 py-12">
        <div className="container max-w-6xl mx-auto bg-white rounded-lg overflow-hidden p-10">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Address Section */}
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-center md:text-left">
                Will you be in Ernakulam or any other branches any time soon? 
                Stop by the office! We’d love to meet.
              </p>
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-gray-800">ADDRESS</p>
                <p className="text-gray-600">PRA 74,Komoroth House,Pattath Road,Chalikkavattom</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-gray-800">PHONE</p>
                <p className="text-gray-600">(+91) 8921504778</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-gray-800">EMAIL</p>
                <p className="text-gray-600">Varghesejoyel71@gmail.com</p>
              </div>
            </div>

            {/* Form Section */}
            <form className="space-y-6 bg-gray-50 p-6 rounded-md shadow-md">
              <div className="flex space-x-4">
                <TextField 
                  label="First Name" 
                  fullWidth 
                  variant="outlined" 
                  className="bg-white"
                />
                <TextField 
                  label="Last Name" 
                  fullWidth 
                  variant="outlined" 
                  className="bg-white"
                />
              </div>
              <TextField 
                label="Email" 
                fullWidth 
                variant="outlined" 
                className="bg-white"
              />
              <TextField 
                label="Subject" 
                fullWidth 
                variant="outlined" 
                className="bg-white"
              />
              <TextField 
                label="Message" 
                fullWidth 
                variant="outlined" 
                multiline 
                rows={4} 
                className="bg-white"
              />
              <Button
                variant="contained"
                color="warning"
                endIcon={<SendIcon />}
                fullWidth
                className="text-lg font-semibold"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
