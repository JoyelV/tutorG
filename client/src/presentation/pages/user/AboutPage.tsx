import React from "react";
import AboutSection from "../../components/common/AboutSection";
import MissionSection from "./MissionSection";
import TestimonialsSection from "../../components/common/TestimonialsSection";
import TrustedCompanies from "../../components/common/TrustedCompanies";
import TopInstructors from "../../components/common/TopInstructors";

const AboutPage: React.FC = () => {
  return (
    <>
      <AboutSection />
      <TrustedCompanies />
      <MissionSection />
      <TopInstructors />
      <TestimonialsSection />
    </>
  );
};

export default AboutPage;
