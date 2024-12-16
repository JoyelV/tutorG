import React from "react";
import { assets } from "../../../assets/assets_user/assets";

const AboutSection: React.FC = () => {
  return (
    <section className="p-6 bg-white flex flex-col lg:flex-row items-center justify-center">
      {/* Left Side - Text Content */}
      <div className="flex items-center justify-center">
        {/* Wrapper for fixed size and centered content */}
        <div
          className="w-[635px] h-[460px] bg-white rounded-lg  p-6 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-semibold text-[#adb0be] mb-2">
            ABOUT US
          </h2>
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            We share knowledge with the world
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Interdum et malesuada fames ac ante ipsum primis in faucibus.
            Praesent fermentum quam mauris. Fusce tempor et augue a aliquet.
            Donec non ipsum non risus egestas tincidunt at vitae nulla.
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex items-center justify-center">
        <img
          src={assets.aboutSectionImage}
          alt="Team Image"
          className="rounded-lg shadow-lg w-[435px] h-[265px] object-cover"
        />
      </div>
    </section>
  );
};

export default AboutSection;
