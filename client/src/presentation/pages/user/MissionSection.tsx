import React from "react";
import { assets } from "../../../assets/assets_user/assets";

const MissionSection: React.FC = () => {
  return (
    <section className="bg-orange-50 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="flex items-center justify-center">
          <img
            src={assets.MissionSectionImage} 
            alt="Mission Image"
            className="rounded-lg w-[572px] h-[400px] object-cover"
            />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold text-orange-500 mb-4">OUR ONE BILLION MISSION</h3>
          <h2 className="text-3xl font-bold mb-4">Our one billion mission sounds bold, We agree.</h2>
          <p className="text-gray-600 leading-relaxed">
          "We cannot solve our problems with the same thinking we used when we created them."—Albert Einstein. Institutions are slow to change. Committees are where good ideas and innovative thinking go to die. Choose agility over dogma. Embrace and drive change. We need to wipe the slate clean and begin with bold, radical thinking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
