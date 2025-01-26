import React from "react";
import { assets } from "../../../assets/assets_user/assets";

const AboutSection: React.FC = () => {
  return (
    <section className="p-6 bg-white flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Left Side - Text Content */}
      <div className="flex items-center justify-center w-full lg:w-auto">
        {/* Wrapper for fixed size and centered content */}
        <div className="bg-white rounded-lg p-6 flex flex-col justify-center max-w-sm lg:max-w-lg">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#adb0be] mb-4 text-center lg:text-left">
            ABOUT US
          </h2>
          <h4 className="text-sm md:text-base font-bold text-gray-700 mb-4 text-center lg:text-left">
            We share knowledge with the world
          </h4>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center lg:text-left">
            Our mission is to provide accessible learning resources to individuals around the globe.
            We aim to bridge the gap between curiosity and understanding by offering comprehensive educational materials.
            Whether you're looking to learn a new skill, advance your career, or broaden your horizons, we are here to support your journey.
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex items-center justify-center w-full lg:w-auto">
        <img
          src={assets.aboutSectionImage}
          alt="Team Image"
          className="rounded-lg shadow-lg w-full max-w-xs md:max-w-sm lg:max-w-md h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default AboutSection;
