import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { assets } from "../../../assets/assets_user/assets";
import { useParams } from "react-router-dom";
import api from "../../../infrastructure/api/api";

const CertificateOfCompletion: React.FC = () => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState({
    courseName: "",
    studentName: "",
    completionDate: "",
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/user/courses-complete/${courseId}`);
        setCourseData({
          courseName: response.data.courseName || "Unknown Course",
          studentName: response.data.studentName || "Anonymous",
          completionDate: response.data.completionDate || "Not completed yet",
        });
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData({
          courseName: "Error loading course",
          studentName: "Error loading name",
          completionDate: "Error loading completion date",
        });
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const downloadPDF = () => {
    const input = certificateRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const pdf = new jsPDF("p", "mm", [canvasWidth * 0.2645, canvasHeight * 0.2645]);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("certificate.pdf");
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8">
      {/* Certificate Body */}
      <div
        ref={certificateRef}
        className="w-full max-w-[800px] mx-auto p-6 sm:p-8 bg-white border-8 border-gray-300 rounded-lg shadow-xl"
      >
        <div className="border-[12px] border-gray-200 rounded-lg p-4 sm:p-6">
          {/* TutorG Logo */}
          <div className="flex justify-center mb-6">
            <img src={assets.logo} alt="TutorG Logo" className="h-16 sm:h-20" />
          </div>

          {/* Certificate Header */}
          <h1 className="text-center text-3xl sm:text-5xl font-serif font-bold mb-4 text-gray-800">
            Certificate of Completion
          </h1>

          {/* Certificate Subheading */}
          <p className="text-center text-lg text-gray-700 font-medium mb-6">
            This is to certify that
          </p>

          {/* Student Name */}
          <p className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {courseData.studentName}
          </p>

          {/* Course Details */}
          <p className="text-center text-lg text-gray-700 mb-4">
            has successfully completed the professional course requirements for
          </p>

          <p className="text-center text-xl sm:text-2xl italic font-semibold text-gray-900 mb-6">
            {courseData.courseName}
          </p>

          {/* Completion Date */}
          <p className="text-center text-lg text-gray-700 mb-8">
            on{" "}
            <span className="font-bold text-gray-900">
              {courseData.completionDate}
            </span>
          </p>

          {/* Divider Line */}
          <hr className="border-t-2 border-gray-300 my-6" />

          {/* Signature Section */}
          <div className="flex justify-between items-center mt-6 px-4 sm:px-8">
            {/* Placeholder for Signature */}
            <div className="text-center">
              <img src={assets.signature} alt="Signature" className="h-12 sm:h-16 mb-2" />
              <p className="text-gray-800 font-semibold">Dr. Joyel Varghese</p>
              <p className="text-gray-500 text-sm">Director, TutorG</p>
            </div>

            {/* Verification Logo */}
            <div className="text-center">
              <img src={assets.seal} alt="Seal" className="h-16 sm:h-20" />
              <p className="text-gray-700 font-semibold mt-2">Official Seal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPDF}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
};

export default CertificateOfCompletion;